const returnClarifaiRequest = (imageUrl) => {
  const PAT = "a1f9cfd6934d4a279577e28985f79d77";
  const USER_ID = "82nxn1prhu8q";
  const APP_ID = "my-first-application-e38qz";
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };
  return requestOptions;
};

const handleApiCalls = (req, res) => {
  const { input } = req.body;
  if (!input) {
    return res.status(400).json("No input provided");
  }

  fetch(
    "https://api.clarifai.com/v2/models/face-detection/outputs",
    returnClarifaiRequest(input)
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error("Error fetching from Clarifai API:", err);
      res.status(400).json("Unable to work with API");
    });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries count"));
};

module.exports = {
  handleImage,
  handleApiCalls,
};
