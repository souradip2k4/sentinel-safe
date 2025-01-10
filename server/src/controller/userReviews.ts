import {CustomResponse} from "../@types/CustomResponse";
import {prisma} from "../..";
import {CustomRequest} from "../@types/express";
import {Response} from "express";

export async function createReview(req: CustomRequest, res: Response) {
  try {
    const {review, rating, geoCodeId, userName} = req.body;
    const user = req.user;
    const noRating = Number(rating);
    if (!review || !rating || !geoCodeId || !user || !userName) {
      return res
      .status(400)
      .send(
        new CustomResponse(
          "Field Required: review, rating, userId, userName or geoCodesId"
        )
      );
    }

    const geoCode = await prisma.geoCode.findUnique({
      where: {id: geoCodeId},
    });

    if (!geoCode)
      return res
      .status(400)
      .send(new CustomResponse("LocationMetric wasn't found"));

    const userId = user.uid;
    const reviewData = await prisma.userReviews.create({
      data: {review, rating: Number(rating), userId, userName, geoCodeId},
    });

    await prisma.geoCode.update({
      where: {id: geoCodeId},
      data: {
        reviewCount: {increment: 1},
        userRating: {
          set:
            (geoCode.userRating * geoCode.reviewCount + reviewData.rating) /
            (geoCode.reviewCount + 1),
        },
      },
    });

    return res
    .status(201)
    .send(new CustomResponse("Review created successfully", reviewData));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function getAllReviews(req: CustomRequest, res: Response) {
  try {
    if (!req.user)
      return res.status(401).send(new CustomResponse("Unauthorized"));
    const userId = req.user.uid;

    const reviews = await prisma.userReviews.findMany({
      where: {userId},
    });
    return res
    .status(200)
    .send(new CustomResponse("All reviews fetched successfully", reviews));
  } catch (error) {
    console.error(error);
    return res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function getReviewsByUser(req: CustomRequest, res: Response) {
  try {
    const {userId} = req.params;

    if (!userId) {
      return res.status(400).send(new CustomResponse("Field Required: userId"));
    }

    const reviews = await prisma.userReviews.findMany({
      where: {userId},
    });

    return res
    .status(200)
    .send(new CustomResponse("Reviews fetched successfully", reviews));
  } catch (error) {
    console.error(error);
    return res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function getReviewsByGeoCode(req: CustomRequest, res: Response) {
  try {
    const {id} = req.params;
    console.log(id);
    if (!id) {
      return res
      .status(400)
      .send(new CustomResponse("Field Required: geoCodesId"));
    }

    const reviews = await prisma.userReviews.findMany({
      where: {geoCodeId: id},
    });

    return res
    .status(200)
    .send(new CustomResponse("Reviews fetched successfully", reviews));
  } catch (error) {
    console.error(error);
    return res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}

export async function deleteReview(req: CustomRequest, res: Response) {
  try {
    const {reviewId} = req.params;

    if (!reviewId) {
      return res
      .status(400)
      .send(new CustomResponse("Field Required: reviewId"));
    }

    const review = await prisma.userReviews.delete({
      where: {id: reviewId},
    });

    res
    .status(200)
    .send(new CustomResponse("Review deleted successfully", review));
  } catch (error) {
    console.error(error);
    res.status(500).send(new CustomResponse("Internal Server Error"));
  }
}
