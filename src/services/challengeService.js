const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/challenges`;

const index = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.data_structure_type) params.append("data_structure_type", filters.data_structure_type);
    if (filters.sort_by) params.append("sort_by", filters.sort_by);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL

    const res = await fetch(url);
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
