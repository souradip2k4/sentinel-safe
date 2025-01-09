import { prisma } from "../..";
import { Response } from "express";
import { geoCodeData } from "../data/geoCode";
import { CustomRequest } from "../@types/express";
import { CustomResponse } from "../@types/CustomResponse";

export const initGeoCode = async (req: CustomRequest, res: Response) => {
  try {
    await prisma.geoCode.deleteMany();
    const geoCodes = await prisma.geoCode.createMany({ data: geoCodeData });
    if (!geoCodes)
      return res.status(500).send(new CustomResponse("Error adding Geo Codes"));
    res
      .status(200)
      .send(new CustomResponse("Geo Codes added successfully", geoCodes));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
};
