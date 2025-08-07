import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import RegisterForm from "../../features/RegisterForm";

// Mock Api請求
vi.mock("../../api/authApiCall", () => ({
  registerApiCall: vi.fn(),
}));

// Mock toast
vi.mock("react-hot-toast", () => ({
  default: {
    promise: vi.fn(),
  },
}));

// Mock Fontawesome
vi.mock("@fortawesome/react-fontawesome", async (importActual) => {
  const actual = await importActual();

  return {
    ...actual,
    FontAwesomeIcon: (props) => {
      return (
        <i data-testid={props["data-testid"]} data-icon-name={props.icon} />
      );
    },
  };
});

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-google-recaptcha
const mockRecaptchaReset = vi.fn();
vi.mock("react-google-recaptcha", async () => {
  const { forwardRef, useImperativeHandle } = await import("react");

  return {
    default: forwardRef((props, ref) => {
      useImperativeHandle(ref, () => ({
        reset: mockRecaptchaReset,
      }));

      return (
        <div
          data-testid="mock-recaptcha"
          onClick={() => props.onChange("mock-recaptcha-token")}
        >
          Mock ReCAPTCHA
        </div>
      );
    }),
  };
});

const { registerApiCall } = await import("../../api/authApiCall");
const toast = (await import("react-hot-toast")).default;

describe("RegisterForm 整合測試", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const TestComponent = () => (
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<div>登入頁面</div>} />
      </Routes>
    </MemoryRouter>
  );

  // --- Happy Path ---
  it("當使用者輸入有效的資料並提交時，應成功導航至登入頁", async () => {
    const user = userEvent.setup();
    let resolveRegister;
    const registerPromise = new Promise((resolve) => {
      resolveRegister = resolve;
    });
    registerApiCall.mockReturnValue(registerPromise);
    toast.promise.mockImplementation((promise) => promise);

    render(<TestComponent />);

    await user.type(screen.getByLabelText("使用者名稱"), "testuser");
    await user.type(screen.getByLabelText("電子郵件"), "test@example.com");
    await user.type(screen.getByLabelText("密碼"), "Password123");
    await user.type(screen.getByLabelText("確認密碼"), "Password123");
    await user.click(screen.getByTestId("mock-recaptcha"));
    await user.click(screen.getByRole("checkbox", { name: /請同意並勾選/i }));

    await user.click(screen.getByRole("button", { name: /註冊/i }));

    // *測試* 按鈕是否在中間狀態
    const submittingButton = screen.getByRole("button", { name: "註冊中..." });
    expect(submittingButton).toBeDisabled();

    // *測試* API傳送的資料是否正確
    expect(registerApiCall).toHaveBeenCalledWith({
      username: "testuser",
      email: "test@example.com",
      password: "Password123",
      ReCAPTCHA: "mock-recaptcha-token",
    });

    await resolveRegister({ success: true });

    // *測試* 是否有呼叫 /login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  // --- Sad Path #1: 驗證失敗 ---
  it("當使用者未輸入任何資料就提交時，應顯示所有驗證錯誤訊息", async () => {
    const user = userEvent.setup();

    render(<TestComponent />);

    await user.click(screen.getByRole("button", { name: /註冊/i }));

    // *測試* 確認是否會報錯
    expect(
      await screen.findByText("* 使用者名稱至少需要 3 個字元")
    ).toBeInTheDocument();
    expect(await screen.findAllByText("* 此為必填欄位")).toHaveLength(2); // email, confirmPassword
    expect(
      await screen.findByText("* 密碼須至少 8 碼，且包含大小寫英文及數字")
    ).toBeInTheDocument();
    expect(await screen.findByText("* 請勾選完成驗證")).toBeInTheDocument();
    expect(
      await screen.findByText("* 請詳閱並同意服務條款")
    ).toBeInTheDocument();

    // *測試* 確認無呼叫 API 與 toast
    expect(registerApiCall).not.toHaveBeenCalled();
    expect(toast.promise).not.toHaveBeenCalled();
  });

  // --- Sad Path #2: 密碼不一致 ---
  it("當密碼與確認密碼不一致時，應顯示錯誤訊息", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    await user.type(screen.getByLabelText("密碼"), "Password123");
    await user.type(screen.getByLabelText("確認密碼"), "Password456");

    await user.click(document.body);

    // *測試* 確認是否會報錯
    expect(
      await screen.findByText("* 兩次輸入的密碼不一致")
    ).toBeInTheDocument();

    // *測試* 確認無呼叫 API 與 toast
    expect(registerApiCall).not.toHaveBeenCalled();
    expect(toast.promise).not.toHaveBeenCalled();
  });

  // --- Sad Path #3: API 呼叫失敗 ---
  it("當 API 請求失敗時，應顯示錯誤訊息並重設 reCAPTCHA", async () => {
    const user = userEvent.setup();
    const apiError = new Error("此電子郵件已被註冊");
    registerApiCall.mockRejectedValue(apiError);

    const mockToastErrorCallback = vi.fn();

    toast.promise.mockImplementation((p, options) =>
      p.catch((err) => {
        options.error(err);
        mockToastErrorCallback(err);
      })
    );

    render(<TestComponent />);

    await user.type(screen.getByLabelText("使用者名稱"), "testuser");
    await user.type(screen.getByLabelText("電子郵件"), "test@example.com");
    await user.type(screen.getByLabelText("密碼"), "Password123");
    await user.type(screen.getByLabelText("確認密碼"), "Password123");
    await user.click(screen.getByTestId("mock-recaptcha"));
    await user.click(screen.getByRole("checkbox", { name: /請同意並勾選/i }));

    await user.click(screen.getByRole("button", { name: /註冊/i }));

    await waitFor(() => {
      // *測試* 呼叫 toast.promise，並正確回傳錯誤訊息
      expect(toast.promise).toHaveBeenCalled();
      expect(mockToastErrorCallback).toHaveBeenCalledWith(apiError);

      // *測試* 重設 recaptcha
      expect(mockRecaptchaReset).toHaveBeenCalledTimes(1);
    });

    // *測試* 確認無呼叫 API
    expect(mockNavigate).not.toHaveBeenCalled();

    // *測試* 按鈕應恢復原狀
    expect(screen.getByRole("button", { name: "註冊" })).toBeEnabled();
  });
});
