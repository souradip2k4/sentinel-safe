import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";

const Sidebar = ({collapsed, setCollapsed}) => {
  const [expanded, setExpanded] = useState(true);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    review: "",
  });

  // Static Data
  const staticMetrics = {
    campusName: "Campus 14",
    peopleCount: 133,
    avgSpeed: 5.768, // kmph
    riskRating: 4, // Safety rating (stars)
    riskLabel: "Safe conditions",
  };

  const staticReviews = [
    {
      name: "Sara Advani",
      sentiment: 5,
      review:
        "Well crowded and safe. One can pass via the campus any time of the day",
    },
    {
      name: "alina",
      sentiment: 4.5,
      review: "Well lit and safe",
    },
    {
      name: "Afreen garg",
      sentiment: 1,
      review:
        "After 10pm the area is deserted so during that time it's not safe to visit that area",
    },
  ];

  const handleAccordionToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={`absolute bg-gray-900  text-white transition duration-300 z-10 top-0 md:h-full h-[90vh] w-full ${
        collapsed
          ? "translate-x-full hidden"
          : "translate-x-0"
      } md:right-0 md:h-full md:w-[310px]`}
    >
      <div className={"relative p-5 pt-2 flex flex-col justify-between w-full h-full "}>
        <CloseIcon
          sx={{
            marginBottom: "1rem",
            height: "30px",
            width: "30px",
          }}
          onClick={() => setCollapsed(!collapsed)}
          className="hover:text-green-200 cursor-pointer"
        />

        {/* Metrics Section */}
        <div className="border flex items-center justify-evenly rounded-lg p-3 text-white text-bold">
          <div className="flex items-center gap-1">
            <span className="text-green-400">👥</span> {staticMetrics.peopleCount}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-400">🚶</span> {staticMetrics.avgSpeed}{" "}
            kmph
          </div>
        </div>

        {/* Overview Section */}
        <Accordion
          defaultExpanded
          onChange={handleAccordionToggle}
          style={{
            background: "#f1f1f194",
            borderRadius: "10px",
            overflowY: "scroll",
            marginTop: "1rem",
          }}
        >
          <AccordionSummary
            aria-controls="panel1-content"
            id="panel1-header"
            className="outline-transparent border-transparent overflow-y-scroll text-center items-center flex flex-col"
          >
            <span className={"w-full"}>
             Overview <span>&nbsp;of {staticMetrics.campusName}</span>
          </span>

          </AccordionSummary>
          <AccordionDetails
            className="outline-transparent border-transparent overflow-y-scroll p-3 flex justify-around"
            style={{background: "#f1f1f194"}}
          >
            <Typography className="font-extralight flex gap-1">
              Safety rating:{" "}
              <Rating
                name="read-only"
                value={staticMetrics.riskRating}
                precision={0.5}
                readOnly
              />
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Reviews Section */}
        <div className="mb-4 overflow-y-scroll">
          <h3 className="text-green-400 text-lg font-semibold mt-2">
            User Reviews
          </h3>
          <div
            className={`cursor-default overflow-y-scroll my-2 ${
              expanded ? "md:h-full" : "md:h-96"
            }`}
          >
            {staticReviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-800 p-3 my-2 rounded-lg shadow-md"
              >
                <Typography className="font-bold text-green-400">
                  {review.name}
                </Typography>
                <Typography className="text-sm text-green-300">
                  {review.sentiment} sentiment rating
                </Typography>
                <Typography className="text-white mt-1">{review.review}</Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Modal */}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col gap-2 -translate-y-1/2 w-96 bg-gray-100 border-2 rounded border-black shadow-lg p-4">
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
                setInputValue({...inputValue, name: event.target.value})
              }
            />
            <TextField
              required
              label="Email"
              variant="outlined"
              onChange={(event) =>
                setInputValue({...inputValue, email: event.target.value})
              }
            />
            <TextField
              label={staticMetrics.campusName}
              disabled
              variant="outlined"
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
              onClick={() => {
                if (
                  inputValue.name === "" ||
                  inputValue.email === "" ||
                  inputValue.review === ""
                ) {
                  alert("Please fill in all the details!");
                } else {
                  alert("Thanks for your review!");
                  setOpen(false);
                }
              }}
            >
              Add
            </Button>
          </Box>
        </Modal>

        {/* Add Review Button */}
        <button
          onClick={() => setOpen(true)}
          className="text-green-400 border-5 text-center w-full absolute bottom-3 right-0 z-100 pt-4 mt-4 bg-gray-900 "
        >
          ADD REVIEWS <AddCircleOutlineRoundedIcon fontSize="medium"/>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;