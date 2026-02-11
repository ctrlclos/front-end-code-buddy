const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/challenges`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const show = async (challengeId) => {
  try {
    const res = await fetch(`${BASE_URL}/${challengeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const create = async (challengeFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(challengeFormData),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const update = async (challengeId, challengeFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${challengeId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(challengeFormData),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteChallenge = async (challengeId) => {
  try {
    const res = await fetch(`${BASE_URL}/${challengeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export { index, show, create, update, deleteChallenge };
