import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { CSA_RWA } from "../typechain-types";

// Describes the test suite for the CSA_RWA contract
describe("CSA_RWA", function () {
  
  // Declare variables accessible to all tests in this suite
  let csa: CSA_RWA;
  let owner: HardhatEthersSigner;
  let consumer1: HardhatEthersSigner;
  let consumer2: HardhatEthersSigner;

  // This hook runs before each `it` block
  beforeEach(async function () {
    // Get test accounts from Hardhat
    [owner, consumer1, consumer2] = await ethers.getSigners();

    const CSA_RWA_Factory = await ethers.getContractFactory("CSA_RWA");

    // Deploy a new, clean instance of the contract, passing the owner as the `initialOwner`
    csa = await CSA_RWA_Factory.deploy(owner.address); 
    await csa.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await csa.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await csa.name()).to.equal("CSA Share");
      expect(await csa.symbol()).to.equal("CSAS");
    });

    it("Should start with zero seasons", async function () {
        // Accessing index 0 of the seasons array should fail (revert)
        await expect(csa.seasons(0)).to.be.reverted; 
    });
  });

  describe("createNewSeason", function () {
    it("Should allow the owner to create a new season", async function () {
      const price = ethers.parseEther("0.1"); // 0.1 AVAX
      await csa.connect(owner).createNewSeason("Summer 2024", price, 100, 12);

      const season = await csa.seasons(0);
      expect(season.name).to.equal("Summer 2024");
      expect(season.membershipPrice).to.equal(price);
      expect(season.totalMemberships).to.equal(100);
    });

    it("Should prevent non-owners from creating a new season", async function () {
      const price = ethers.parseEther("0.1");
      await expect(
        csa.connect(consumer1).createNewSeason("Summer 2024", price, 100, 12)
      ).to.be.revertedWithCustomError(csa, "OwnableUnauthorizedAccount").withArgs(consumer1.address);
    });
  });

  describe("buyMembership", function () {
    const price = ethers.parseEther("0.1");

    beforeEach(async function () {
      // Create a season before each test in this section
      await csa.connect(owner).createNewSeason("Test Season", price, 2, 4);
    });

    it("Should allow a consumer to buy a membership (mint an NFT)", async function () {
      await csa.connect(consumer1).buyMembership({ value: price });
      
      expect(await csa.balanceOf(consumer1.address)).to.equal(1);
      expect(await csa.ownerOf(0)).to.equal(consumer1.address);
    });

    it("Should fail if the sent value is incorrect", async function () {
      const wrongPrice = ethers.parseEther("0.05");
      await expect(
        csa.connect(consumer1).buyMembership({ value: wrongPrice })
      ).to.be.revertedWith("CSA: Incorrect amount sent");
    });

    it("Should fail if all memberships are sold out", async function () {
      await csa.connect(consumer1).buyMembership({ value: price });
      await csa.connect(consumer2).buyMembership({ value: price });

      // Another person tries to buy
      await expect(
        csa.connect(owner).buyMembership({ value: price }) 
      ).to.be.revertedWith("CSA: All shares have been sold");
    });
    
    it("Should fail if sales for the season are closed", async function () {
      await csa.connect(owner).closeSeasonSales(0);
      await expect(
        csa.connect(consumer1).buyMembership({ value: price })
      ).to.be.revertedWith("CSA: Sales are closed for this season");
    });

    it("Should fail if no seasons have been created yet", async function () {
        // We need a fresh contract instance for this test
        const NewCSAFactory = await ethers.getContractFactory("CSA_RWA");
        const newCsa = await NewCSAFactory.deploy(owner.address);
        await newCsa.waitForDeployment();
        
        await expect(
            newCsa.connect(consumer1).buyMembership({ value: price })
        ).to.be.reverted; // Reverts because seasons array is empty
    });
  });

  describe("Redeeming and Season Management", function () {
    const price = ethers.parseEther("0.1");

    beforeEach(async function () {
      await csa.connect(owner).createNewSeason("Test Season", price, 10, 2); // 2-week season
      // consumer1 now owns token 0
      await csa.connect(consumer1).buyMembership({ value: price }); 
    });

    it("Should allow the token owner to redeem a weekly box", async function () {
      await expect(csa.connect(consumer1).redeemWeeklyBox(0))
        .to.emit(csa, "BoxRedeemed")
        .withArgs(0, 0); // TokenId 0, week 0
    });

    it("Should prevent non-owners from redeeming a box", async function () {
      await expect(
        csa.connect(consumer2).redeemWeeklyBox(0)
      ).to.be.revertedWith("CSA: You are not the owner of this token");
    });
    
    it("Should prevent redeeming the same box twice in the same week", async function () {
      await csa.connect(consumer1).redeemWeeklyBox(0); // First redemption
      await expect(
        csa.connect(consumer1).redeemWeeklyBox(0)
      ).to.be.revertedWith("CSA: This week's box has already been redeemed");
    });

    it("Should fail if trying to redeem after the season has ended", async function () {
        // Fast-forward time by 3 weeks, past the 2-week season duration
        const threeWeeksInSeconds = 21 * 24 * 60 * 60;
        await time.increase(threeWeeksInSeconds);

        await expect(
            csa.connect(consumer1).redeemWeeklyBox(0)
        ).to.be.revertedWith("CSA: Outside of the season period");
    });

    it("Should allow the owner to close season sales", async function () {
      await expect(csa.connect(owner).closeSeasonSales(0)).to.not.be.reverted;
      const season = await csa.seasons(0);
      expect(season.isOpenForSale).to.be.false;
    });

    it("Should prevent non-owners from closing season sales", async function () {
      await expect(
        csa.connect(consumer1).closeSeasonSales(0)
      ).to.be.revertedWithCustomError(csa, "OwnableUnauthorizedAccount").withArgs(consumer1.address);
    });

    it("Should fail when closing a non-existent season", async function () {
        const invalidSeasonId = 999;
        await expect(
            csa.connect(owner).closeSeasonSales(invalidSeasonId)
        ).to.be.reverted;
    });
  });
  
  describe("withdraw", function () {
    it("Should allow the owner to withdraw the contract balance", async function () {
      const price = ethers.parseEther("1.0");
      await csa.connect(owner).createNewSeason("Withdraw Test", price, 10, 4);
      await csa.connect(consumer1).buyMembership({ value: price });
      
      // We expect the owner's balance to increase by 1.0 ETH/AVAX
      await expect(
        csa.connect(owner).withdraw()
      ).to.changeEtherBalance(owner, price);
    });

    it("Should prevent non-owners from withdrawing", async function () {
      await expect(
        csa.connect(consumer1).withdraw()
      ).to.be.revertedWithCustomError(csa, "OwnableUnauthorizedAccount").withArgs(consumer1.address);
    });
  });

  describe("getCurrentWeek", function () {
    beforeEach(async function () {
        // Create a season that starts now
        await csa.connect(owner).createNewSeason("Time Test", ethers.parseEther("0.1"), 10, 10);
    });

    it("Should return 0 if the season has not started yet", async function () {
        // This test covers the `if (block.timestamp < season.startTime)` branch
        // We check the time right at the beginning, so it should be less than startTime + a few seconds
        expect(await csa.getCurrentWeek(0)).to.equal(0);
    });

    it("Should return the correct week number after time has passed", async function () {
        // Fast-forward time by 2 weeks (in seconds)
        const twoWeeksInSeconds = 14 * 24 * 60 * 60;
        await time.increase(twoWeeksInSeconds);
        
        expect(await csa.getCurrentWeek(0)).to.equal(2);
    });

    it("Should fail when getting the week of a non-existent season", async function () {
        const invalidSeasonId = 999;
        await expect(
            csa.getCurrentWeek(invalidSeasonId)
        ).to.be.reverted;
    });
  });

  describe("supportsInterface", function () {
    it("should support the ERC721Enumerable interface", async function () {
      // The interface ID for ERC721Enumerable is 0x780e9d63
      expect(await csa.supportsInterface("0x780e9d63")).to.be.true;
    });

    it("should support the ERC721 interface", async function () {
      // The interface ID for ERC721 is 0x80ac58cd
      expect(await csa.supportsInterface("0x80ac58cd")).to.be.true;
    });

    it("should support the ERC165 interface", async function () {
      // The interface ID for ERC165 is 0x01ffc9a7
      expect(await csa.supportsInterface("0x01ffc9a7")).to.be.true;
    });

    it("should not support a random interface", async function () {
      // A random interface ID
      expect(await csa.supportsInterface("0xffffffff")).to.be.false;
    });
  });
});