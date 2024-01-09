import { setPrevRandao } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import type { Compression } from "../../types/Compression";
import type { Compression__factory } from "../../types/factories/Compression__factory";
import type { Signers } from "../types";

describe("Compression", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Deployment", function () {
    beforeEach(async function () {
      const compressionFactory = (await ethers.getContractFactory("Compression")) as Compression__factory;
      const compression = (await compressionFactory.deploy(2)) as Compression;
      const compression_address = await compression.getAddress();
      this.compression = compression;
      this.compression_address = compression_address;
    });

    it("Update dict", async function () {
      await this.compression.process("0x0000000000000000000000000000000000000000000000000000000000000000");
      expect(await this.compression.getLength()).to.equal(1);
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000000"),
      ).to.equal(1);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000000"),
      ).to.equal(1);

      await this.compression.process("0x0000000000000000000000000000000000000000000000000000000000000001");
      expect(await this.compression.getLength()).to.equal(2);
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000001"),
      ).to.equal(2);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000001"),
      ).to.equal(1);

      await this.compression.process("0x0000000000000000000000000000000000000000000000000000000000000000");
      expect(await this.compression.getLength()).to.equal(2);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000000"),
      ).to.equal(2);

      // Won't change anything
      await this.compression.process("0x0000000000000000000000000000000000000000000000000000000000000002");
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000000"),
      ).to.equal(1);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000000"),
      ).to.equal(2);
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000001"),
      ).to.equal(2);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000001"),
      ).to.equal(1);

      // Try to replace dict[0], but fail
      await setPrevRandao(0);
      await this.compression.process("0x0000000000000000000000000000000000000000000000000000000000000002");
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000000"),
      ).to.equal(1);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000000"),
      ).to.equal(2);
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000001"),
      ).to.equal(2);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000001"),
      ).to.equal(1);
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000002"),
      ).to.equal(0);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000002"),
      ).to.equal(2);

      // Try to replace dict[1], and succeed
      await setPrevRandao(1);
      await this.compression.process("0x0000000000000000000000000000000000000000000000000000000000000002");
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000000"),
      ).to.equal(1);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000000"),
      ).to.equal(2);
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000001"),
      ).to.equal(0);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000001"),
      ).to.equal(1);
      expect(
        await this.compression.positionMap("0x0000000000000000000000000000000000000000000000000000000000000002"),
      ).to.equal(2);
      expect(
        await this.compression.frequencyMap("0x0000000000000000000000000000000000000000000000000000000000000002"),
      ).to.equal(3);
    });
  });
});
