// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.1/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.1/contracts/access/Ownable.sol";

/**
 * @title CSA_RWA
 * @author E-co.lab Dev Team
 * @notice A prototype contract for a Community Supported Agriculture (CSA)
 * using NFTs (ERC721Enumerable) to represent member shares (RWA).
 * Each NFT represents the right to receive a natural product box for a specific season.
 */
contract CSA_RWA is ERC721Enumerable, Ownable {
    
    // Struct to define the data for a harvest season
    struct Season {
        string name;                // E.g., "Summer Harvest 2024"
        uint256 membershipPrice;    // Price of the share in wei
        uint256 totalMemberships;   // Maximum number of members
        uint256 soldMemberships;    // Number of shares already sold
        uint256 startTime;          // Timestamp for the season's start
        uint256 endTime;            // Timestamp for the season's end
        bool isOpenForSale;         // Whether new shares can be purchased
    }

    // Array to store all created seasons
    Season[] public seasons;

    // Mapping from token ID (NFT) to its corresponding season ID
    mapping(uint256 => uint256) public tokenIdToSeasonId;

    // Mapping to track the weekly redemption of a box
    // tokenId => week number => boolean (true if already redeemed)
    mapping(uint256 => mapping(uint256 => bool)) public weeklyRedemptions;

    // Counter for token IDs
    uint256 private _nextTokenId;

    // Events to notify the frontend about important actions
    event SeasonCreated(uint256 seasonId, string name, uint256 price, uint256 capacity);
    event MembershipPurchased(uint256 seasonId, uint256 tokenId, address member);
    event BoxRedeemed(uint256 tokenId, uint256 weekNumber);

    /**
     * @dev The constructor sets the NFT's name and symbol, and the contract owner.
     */
    constructor(address initialOwner) ERC721("CSA Share", "CSAS") Ownable(initialOwner) {}

    /**
     * @notice (Owner) Creates a new harvest season.
     * @param name The name of the season (e.g., "Spring 2024").
     * @param price The price of the share in WEI (1 ETH = 1e18 wei).
     * @param capacity The maximum number of members the CSA supports.
     * @param durationInWeeks The duration of the season in weeks.
     */
    function createNewSeason(string memory name, uint256 price, uint256 capacity, uint256 durationInWeeks) external onlyOwner {
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (durationInWeeks * 1 weeks);
        
        seasons.push(Season({
            name: name,
            membershipPrice: price,
            totalMemberships: capacity,
            soldMemberships: 0,
            startTime: startTime,
            endTime: endTime,
            isOpenForSale: true
        }));
        
        uint256 seasonId = seasons.length - 1;
        emit SeasonCreated(seasonId, name, price, capacity);
    }

    /**
     * @notice (Owner) Closes sales for a specific season.
     */
    function closeSeasonSales(uint256 seasonId) external onlyOwner {
        require(seasonId < seasons.length, "CSA: Invalid season ID");
        seasons[seasonId].isOpenForSale = false;
    }

    /**
     * @notice (Public) Buys a membership share for the latest open season.
     * The user must send the exact price of the share in Ether.
     */
    function buyMembership() external payable {
        uint256 seasonId = seasons.length - 1; // Always buys from the last created season
        require(seasonId < seasons.length, "CSA: No open season available");
        
        Season storage currentSeason = seasons[seasonId];

        require(currentSeason.isOpenForSale, "CSA: Sales are closed for this season");
        require(currentSeason.soldMemberships < currentSeason.totalMemberships, "CSA: All shares have been sold");
        require(msg.value == currentSeason.membershipPrice, "CSA: Incorrect amount sent");

        currentSeason.soldMemberships++;
        
        uint256 tokenId = _nextTokenId++;
        tokenIdToSeasonId[tokenId] = seasonId;
        
        _safeMint(msg.sender, tokenId);
        
        emit MembershipPurchased(seasonId, tokenId, msg.sender);
    }

    /**
     * @notice (NFT Owner) Redeems the weekly box.
     * @param tokenId The ID of your membership NFT.
     */
   function redeemWeeklyBox(uint256 tokenId) external {
        require(_ownerOf(tokenId) == msg.sender, "CSA: You are not the owner of this token");
        
        uint256 seasonId = tokenIdToSeasonId[tokenId];
        Season storage season = seasons[seasonId];

        require(block.timestamp >= season.startTime && block.timestamp <= season.endTime, "CSA: Outside of the season period");

        uint256 currentWeek = (block.timestamp - season.startTime) / 1 weeks;

        require(!weeklyRedemptions[tokenId][currentWeek], "CSA: This week's box has already been redeemed");

        weeklyRedemptions[tokenId][currentWeek] = true;
        emit BoxRedeemed(tokenId, currentWeek);
    }
    
    /**
     * @notice (Owner) Withdraws the contract's balance.
     */
    function withdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "CSA: Withdrawal failed");
    }

    // --- View Functions ---

    /**
     * @notice Returns the current week number for a given season.
     */
    function getCurrentWeek(uint256 seasonId) public view returns (uint256) {
        require(seasonId < seasons.length, "CSA: Invalid season ID");
        Season storage season = seasons[seasonId];
        if (block.timestamp < season.startTime) return 0;
        return (block.timestamp - season.startTime) / 1 weeks;
    }

    /**
     * @dev See {IERC165-supportsInterface}. This is required for contracts that inherit from multiple standards.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, Ownable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
