const API_URL = import.meta.env.VITE_BACK_END_SERVER_URL;
const BASE_URL = `${API_URL}/challenges`;
//GET /challenges/:id/test-cases
const index = async (challengeId) => {
  try {
    const res = await fetch(`${BASE_URL}/${challengeId}/test-cases`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return res.json()
  } catch (err) {
    throw err
  }
}
//POST /challenges/:id/test-cases
const createTestCase = async (challengeId, testCaseData) => {
    const res = await fetch(`${BASE_URL}/${challengeId}/test-cases`, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify(testCaseData)
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || "Failed to create test case");
    }

    return res.json();
}
//PUT /test-cases/:id
const updateTestCase = async (testCaseId, testCaseData) => {
  try {
    const res = await fetch(`${API_URL}/test-cases/${testCaseId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testCaseData)
    });
    return res.json()
  } catch(err) {
    throw err
  }
}

//DELETE /test-cases/:id
const removeTestCase = async (testCaseId) => {
  try {
    const res = await fetch(`${API_URL}/test-cases/${testCaseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    return res.json()
  } catch (err) {
    throw err
  }
}

const generateTestCases = async (challengeId) => {
  const res = await fetch(`${BASE_URL}/${challengeId}/generate-test-cases`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if(!res.ok) {
    const body = await res.json();
    throw new Error(body.error || "Failed to generate test cases");
  }

  return res.json();
};


export { index, createTestCase, updateTestCase, removeTestCase, generateTestCases };
