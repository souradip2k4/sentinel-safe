import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import {auth} from "@/firebase.config";
import toast from "react-hot-toast";
import useStore from "@/zustand/store";
import {useShallow} from "zustand/react/shallow";
import {createReview} from "@/lib/axios";
import {AxiosError} from "axios";

const Sidebar = ({collapsed, setCollapsed}) => {

  const {reviews, geoCodeId, setUserReview} = useStore(
    useShallow((state) => ({
      reviews: state.reviews,
      geoCodeId: state.geoCodeId,
      setUserReview: state.setUserReview
    }))
  );

  // console.log("Geocode ", geoCodeId)
  const [expanded, setExpanded] = useState(true);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    userName: "",
    rating: "",
    review: "",
    geoCodeId: ""
  });

  useEffect(() => {
    setInputValue({...inputValue, geoCodeId})
  }, []);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  async function addUserReviews() {
    if (!auth.currentUser.isAnonymous) {
      setOpen(true);
    } else {
      toast.error("Register your account to add user reviews");
    }
  }

  const handleReviewSubmit = async (e) => {
    if (
      inputValue.userName === "" ||
      inputValue.rating === "" ||
      inputValue.review === ""
    ) {
      alert("Please fill in all the details!");
    } else {
      try {
        const userId = await auth.currentUser.getIdToken(true);
        const response = await createReview(userId, inputValue);

        console.log(response.data.message);
        setUserReview(inputValue);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      } finally {
        setOpen(false);
      }
    }
  }

  return (
    <div
      className={`absolute z-50 bg-gray-900 text-white transition duration-300 top-0 md:h-full h-[90vh] w-full ${
        collapsed ? "translate-x-full hidden" : "translate-x-0"
      } md:right-0 md:h-full md:w-[310px]`}
    >
      <div className="relative p-5 pt-2 flex flex-col justify-between w-full h-full">
        <CloseIcon
          sx={{
            marginBottom: "1rem",
            height: "30px",
            width: "30px",
          }}
          onClick={() => setCollapsed(!collapsed)}
          className="hover:text-green-200 cursor-pointer"
        />

        {/* Conditional Rendering for Overview Section */}
        {reviews.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
            <Typography className="text-white text-lg font-semibold text-center">
              Overview of {reviews[0]?.campusName || "Campus"}
            </Typography>
            <div className="flex justify-center items-center mt-2">
              <Typography className="text-green-400 flex items-center gap-2">
                Safety Rating:
                <Rating
                  name="read-only"
                  value={averageRating}
                  precision={0.5}
                  readOnly
                />
              </Typography>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <Typography className="text-green-300 text-lg font-semibold text-center">
                Reviews Not Found
              </Typography>
              <Typography className="text-white text-sm mt-2 text-center">
                Be the first one to create a user review!
              </Typography>
            </div>
          </div>
        ) : (
          <div className="mb-4 overflow-y-scroll">
            <h3 className="text-green-400 text-lg font-semibold mt-2">
              User Reviews
            </h3>
            <div
              className={`cursor-default overflow-y-scroll my-2 ${
                expanded ? "md:h-full" : "md:h-96"
              }`}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-3 my-2 rounded-lg shadow-md"
                >
                  <Typography className="font-bold text-green-400">
                    {review.userName}
                  </Typography>
                  <Typography className="text-sm text-green-300 whitespace-pre-wrap">
                    User rating: {review.rating}
                  </Typography>
                  <Typography className="text-white mt-1">
                    {review.review}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Review Modal */}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col gap-2 -translate-y-1/2 w-96 bg-gray-100 border-2 rounded border-black shadow-lg p-4"
          >
            <Typography
              id="modal-modal-title"
              component="h2"
              className="text-base text-green-600 font-bold"
            >
              Add your review:
            </Typography>

            <TextField
              required
              label="Username"
              variant="outlined"
              onChange={(event) =>
                setInputValue({...inputValue, userName: event.target.value})
              }
            />
            <TextField
              required
              label="Rating"
              variant="outlined"
              onChange={(event) =>
                setInputValue({...inputValue, rating: event.target.value})
              }
            />
            <TextField
              required
              label="Review"
              variant="outlined"
              onChange={(event) =>
                setInputValue({...inputValue, review: event.target.value})
              }
            />
            <Button
              variant="contained"
              color="success"
              className="bg-green-700"
              onClick={handleReviewSubmit}
            >
              Add
            </Button>
          </Box>
        </Modal>

        {/* Add Review Button */}
        <button
          onClick={addUserReviews}
          className="text-green-400 border-5 text-center w-full absolute bottom-3 right-0 z-100 pt-4 mt-4 bg-gray-900 "
        >
          ADD REVIEWS <AddCircleOutlineRoundedIcon fontSize="medium"/>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
