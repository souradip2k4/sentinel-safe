import { prisma } from "../../index";
import { Response } from "express";
import { LocMetrics } from "../@types/LocMetrics";
import { CustomResponse } from "../@types/CustomResponse";
import { CustomRequest } from "../@types/express";

//
export async function createLocMetrics(req: CustomRequest, res: Response) {
  try {
    const { lumen, peopleCount, areaRating, geoCodesId }: LocMetrics = req.body;

    if (!peopleCount || !geoCodesId) {
      return res
        .status(400)
        .send(new CustomResponse("Required fields: peopleCount, geoCodesId"));
    }

    const newMetrics = await prisma.locationMetrics.create({
      data: { lumen, peopleCount, areaRating, geoCodesId },
    });
    res
      .status(201)
      .send(new CustomResponse("Location Metrics created", newMetrics));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse(error as string));
  }
}

export async function updateLocMetrics(req: CustomRequest, res: Response) {
  try {
    const { peopleCount, lumen, areaRating, geoCodesId }: LocMetrics = req.body;
    const { id } = req.params;

    if (!id)
      return res.status(400).send(new CustomResponse("Field Required: id"));

    const updatedMetrics = await prisma.locationMetrics.update({
      where: { id },
      data: {
        lumen,
        peopleCount,
        areaRating,
        geoCodesId,
      },
    });

    res
      .status(200)
      .send(new CustomResponse("Location Metrics updated", updatedMetrics));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function updateLocMetricsByCampus(
  req: CustomRequest,
  res: Response
) {
  try {
    const { peopleCount, lumen, areaRating }: LocMetrics = req.body;
    const { campusName } = req.params;

    if (!campusName) {
      return res
        .status(400)
        .send(new CustomResponse("Field Required: campusName"));
    }

    const updatedMetrics = await prisma.locationMetrics.updateMany({
      where: { GeoCode: { campusName } },
      data: {
        peopleCount,
        lumen,
        areaRating,
      },
    });

    res
      .status(200)
      .send(new CustomResponse("Location Metrics updated", updatedMetrics));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

//
export async function getLocMetrics(req: CustomRequest, res: Response) {
  try {
    const metrics = await prisma.locationMetrics.findMany({
      select: {
        id: true,
        areaRating: true,
        GeoCode: {
          select: {
            campusName: true,
            latitude: true,
            longitude: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      distinct: ["geoCodesId"],
    });

    res.status(200).send(new CustomResponse("Location Metrics found", metrics));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

//
export async function getLocMetricsByIDCampus(
  req: CustomRequest,
  res: Response
) {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .send(new CustomResponse("Field Required: campusName"));
    }

    const metrics = await prisma.locationMetrics.findMany({
      where: { OR: [{ id }, { GeoCode: { campusName: { contains: id } } }] },
    });

    res.status(200).send(new CustomResponse("Location Metrics found", metrics));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function getLocMetricsByRisk(req: CustomRequest, res: Response) {
  try {
    const { riskRating } = req.params;

    if (!riskRating) {
      return res
        .status(400)
        .send(new CustomResponse("Field Required: riskRating"));
    }

    const metrics = await prisma.locationMetrics.findMany({
      where: { areaRating: { gt: Number(riskRating) } },
    });

    res.status(200).send(new CustomResponse("Location Metrics found", metrics));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function getLocMetricsByTime(req: CustomRequest, res: Response) {
  try {
    const { updatedAfter } = req.params;

    if (!updatedAfter) {
      return res
        .status(400)
        .send(new CustomResponse("Field Required: updatedAfter"));
    }

    const metrics = await prisma.locationMetrics.findMany({
      where: { updatedAt: { gt: new Date(updatedAfter) } },
    });

    res.status(200).send(new CustomResponse("Location Metrics found", metrics));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function getLocMetricsByGeoCode(
  req: CustomRequest,
  res: Response
) {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .send(new CustomResponse("Fields Required: latitude, longitude"));
    }

    const metric = await prisma.locationMetrics.findFirst({
      where: {
        GeoCode: {
          latitude: latitude as string,
          longitude: longitude as string,
        },
      },
    });

    if (!metric) {
      return res
        .status(404)
        .send(new CustomResponse("Location Metrics not found"));
    }

    res.status(200).send(new CustomResponse("Location Metrics found", metric));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function getLatestData(req: CustomRequest, res: Response) {
  try {
    const metrics = await prisma.locationMetrics.findMany({
      orderBy: { updatedAt: "desc" },
      distinct: ["geoCodesId"],
    });

    res
      .status(200)
      .send(new CustomResponse("Latest Location Metrics found", metrics));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function deleteLocMetrics(req: CustomRequest, res: Response) {
  try {
    const speedPeople = await prisma.locationMetrics.delete({
      where: { id: req.params.id },
    });
    if (!speedPeople)
      return res
        .status(404)
        .send(new CustomResponse("Location Metrics not found"));
    res
      .status(200)
      .send(new CustomResponse("Location Metrics deleted", speedPeople));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}
