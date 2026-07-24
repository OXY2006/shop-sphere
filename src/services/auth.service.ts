type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  errors?: unknown;
  user?: T;
};

async function handleResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message,
      errors: data.errors,
    };
  }

  return data;
}

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function logoutUser() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  return handleResponse(response);
}