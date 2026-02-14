const BASE_URL = `${import.meta.env.VITE_BACKEND_SERVER_URL}/progress`;

const getStats = async () => {
  try {
    const res = await fetch( `${BASE_URL}/stats`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error)
  }
};

const getActivity = async (limit = 20) => {
  try {
    const res = await fetch(`${BASE_URL}/activity?limit=${limit}`, {
      headers: {
        Authorization: `Bearer: ${localStorage.getItem("token")}`,
      }
    });
    return res.json();
  } catch (error) {
    console.log(err);
  }
};

export { getStats, getActivity };
