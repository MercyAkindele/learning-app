const API_BASE_URL =
  import.meta.env.VITE_APP_REACT_APP_API_BASE_URL || "http://localhost:8080";
const headers = new Headers();
headers.append("Content-Type", "application/json");
//let data:any;
type Options = {
  headers: Headers;
  signal?: AbortSignal | null;
  method: string;
  body?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchJson = async (
  url: URL,
  options: Options,
  onCancel: AbortSignal | null,
): Promise<any> => {
  try {
    const response = await fetch(url, options);
    if (response.status === 204) {
      return null;
    }
    const payload = await response.json();
    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error: unknown) {
    if (error instanceof Error)
      if (error.name !== "AbortError") {
        console.error(error.stack);
        throw error;
      }
    return Promise.resolve(onCancel);
  }
};

type CheckIfWeCanPomodoroDataType = {
  selectedSubject: string;
  studyIncrements: number;
  totalDuration: number;
};

export async function checkIfWeCanPomodoro(
  token: string,
  data: CheckIfWeCanPomodoroDataType,
) {
  const url = new URL(`${API_BASE_URL}/api/pomodoro`);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const options: Options = {
    headers,
    method: "POST",
    body: JSON.stringify({ data }),
  };
  return await fetchJson(url, options, null);
}

export async function sendSubjectForValidation(token: string, data: string) {
  const url = new URL(`${API_BASE_URL}/api/subject`);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const options: Options = {
    headers,
    method: "POST",
    body: JSON.stringify({ data }),
  };
  return await fetchJson(url, options, null);
}

export async function getSubjects(token: string) {
  const url = new URL(`${API_BASE_URL}/api/subject`);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const options: Options = {
    headers,
    method: "GET",
  };
  return await fetchJson(url, options, null);
}

export async function getASubjectId(token: string, subjectName: string) {
  const url = new URL(`${API_BASE_URL}/api/subject/${subjectName}`);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const options: Options = {
    headers,
    method: "GET",
  };
  return await fetchJson(url, options, null);
}

type SaveNotesDataType = {
  subjectIdentification: number | undefined;
  note: string;
};

export async function saveNotes(token: string, data: SaveNotesDataType) {
  const url = new URL(`${API_BASE_URL}/api/notes`);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const options: Options = {
    headers,
    method: "POST",
    body: JSON.stringify({ data }),
  };
  return await fetchJson(url, options, null);
}

export async function getNotes(token: string, subjectId: number | undefined) {
  const url = new URL(`${API_BASE_URL}/api/notes/${subjectId}`);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const options: Options = {
    headers,
    method: "GET",
  };
  return await fetchJson(url, options, null);
}

type EditNoteDataType = {
  note: string;
  noteId: number;
};

export async function editNote(
  token: string,
  subjectId: number | undefined,
  data: EditNoteDataType,
) {
  const url = new URL(`${API_BASE_URL}/api/notes/${subjectId}`);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const options: Options = {
    headers,
    method: "PUT",
    body: JSON.stringify({ data }),
  };
  return await fetchJson(url, options, null);
}

export async function deleteNote(
  token: string,
  subjectId: number | undefined,
  notesId: number,
) {
  const url = new URL(`${API_BASE_URL}/api/notes/${subjectId}/${notesId}`);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const options: Options = {
    headers,
    method: "DELETE",
  };
  return await fetchJson(url, options, null);
}
