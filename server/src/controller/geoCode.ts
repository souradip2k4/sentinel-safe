import { prisma } from "../../index";
import { GeoCode } from "../@types/GeoCode";
import { Response } from "express";
import { CustomResponse } from "../@types/CustomResponse";
import { CustomRequest } from "../@types/express";

export const createGeoCode = async (req: CustomRequest, res: Response) => {
  try {
    const { latitude, longitude, campusName, camId }: GeoCode = req.body;
    if (!latitude || !longitude || !campusName || !camId || camId.length === 0)
      return res
        .status(400)
        .send(
          new CustomResponse(
            "Field Required: latitude, longitude, campusName, camId"
          )
        );

    const newGeoCode = await prisma.geoCode.create({
      data: { latitude, longitude, campusName, camId },
    });
    if (!newGeoCode)
      return res.status(404).send(new CustomResponse("Not Found"));

    res.status(201).send(new CustomResponse("GeoCode created", newGeoCode));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
};

export const getGeoCode = async (req: CustomRequest, res: Response) => {
  try {
    const geoCodes = await prisma.geoCode.findMany({});
    res.status(200).send(new CustomResponse("GeoCode found", geoCodes));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
};

export const getGeoCodeByCampusCamera = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    if (!req.params.id)
      return res
        .status(400)
        .send(new CustomResponse("Campus Name is required"));
    const geoCodes = await prisma.geoCode.findMany({
      where: {
        OR: [
          { id: req.params.id },
          { campusName: { contains: req.params.id } },
          { camId: { has: req.params.id } },
        ],
      },
    });
    if (!geoCodes) return res.status(404).send(new CustomResponse("Not Found"));
    res.status(200).send(new CustomResponse("GeoCode found", geoCodes));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
};

export const updateGeoCode = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.params.id)
      return res.status(400).send(new CustomResponse("GeoCode Id is required"));

    const { latitude, longitude, campusName, camId }: GeoCode = req.body;
    if (!latitude || !longitude || !campusName || !camId || camId.length === 0)
      return res
        .status(400)
        .send(
          new CustomResponse(
            "Field Required: latitude, longitude, campusName, camId"
          )
        );
    const updatedGeoCode = await prisma.geoCode.update({
      where: { id: req.params.id },
      data: { latitude, longitude, campusName, camId },
    });

    if (!updatedGeoCode)
      return res.status(404).send(new CustomResponse("Not Found"));
    res.status(200).send(new CustomResponse("GeoCode updated", updatedGeoCode));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
};

export const deleteGeoCode = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.params.id)
      return res.status(400).send(new CustomResponse("GeoCode Id is required"));

    const deletedGeoCode = await prisma.geoCode.delete({
      where: { id: req.params.id },
    });
    if (!deletedGeoCode)
      return res.status(404).send(new CustomResponse("Not Found"));
    res.status(200).send(new CustomResponse("GeoCode deleted"));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
};
