const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/challenges`;

const submit = async(challengeId, submissionData) => {
  try {
    const res = await fetch(`${BASE_URL}/${challengeId}/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });
    return res.json();
  } catch (err) {
    console.log(err)
  }
}

const getSubmissions = async (challengeId) => {
  try {
    const res = await fetch(`${BASE_URL}/${challengeId}/submissions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  } catch(err) {
    console.log(err)
  }
}

export { submit, getSubmissions };
