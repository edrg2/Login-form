import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../../features/LoginForm";

// Mock API 請求
vi.mock("../../api/authApiCall", () => ({
  loginApiCall: vi.fn(),
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

const { loginApiCall } = await import("../../api/authApiCall");
const toast = (await import("react-hot-toast")).default;

describe("LoginForm 整合測試", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- Happy Path ---
  it("當使用者輸入有效資料並提交時，應成功呼叫 API 並顯示 toast 成功訊息重設表單", async () => {
    const user = userEvent.setup();

    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    loginApiCall.mockReturnValue(loginPromise);
    toast.promise.mockImplementation((promise) => promise);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText("電子郵件");
    const passwordInput = screen.getByLabelText("密碼");

    // 模擬輸入
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "Password123");
    await user.click(screen.getByTestId("mock-recaptcha"));

    await user.click(screen.getByRole("button", { name: /登入/i }));

    // *測試* 按鈕是否在中間狀態
    const submittingButton = screen.getByRole("button", { name: "登入中..." });
    expect(submittingButton).toBeDisabled();

    await waitFor(() => {
      // *測試* 呼叫 toast.promise，並檢查傳入的訊息
      expect(toast.promise).toHaveBeenCalledWith(
        expect.any(Promise),
        {
          loading: "正在登入中，請稍後...",
          success: "登入成功！歡迎回來",
          error: expect.any(Function),
        },
        expect.any(Object)
      );

      // *測試* 呼叫API
      expect(loginApiCall).toHaveBeenCalledTimes(1);
      expect(loginApiCall).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password123",
        ReCAPTCHA: "mock-recaptcha-token",
      });
    });

    await resolveLogin({ success: true });

    // *測試* 3: 重設表單和 reCAPTCHA
    await waitFor(() => {
      expect(emailInput.value).toBe("");
      expect(passwordInput.value).toBe("");
      expect(mockRecaptchaReset).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button", { name: "登入" })).toBeEnabled();
    });
  });

  // --- Sad Path #1: 驗證失敗 ---
  it("當使用者未輸入任何資料就提交時，應顯示驗證錯誤訊息", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /登入/i }));

    // *測試* 確認是否會報錯
    expect(await screen.findByText("* 此為必填欄位")).toBeInTheDocument();
    expect(
      await screen.findByText("* 密碼長度不能少於 8 個字元")
    ).toBeInTheDocument();
    expect(await screen.findByText("* 請勾選完成驗證")).toBeInTheDocument();

    // *測試* 確認無呼叫 API 與 toast
    expect(loginApiCall).not.toHaveBeenCalled();
    expect(toast.promise).not.toHaveBeenCalled();
  });

  // --- Sad Path #2: API 呼叫失敗 ---
  it("當 API 請求失敗時，應顯示 toast 錯誤訊息並重設表單", async () => {
    const user = userEvent.setup();
    const errorMessage = "帳號或密碼錯誤";
    const apiError = new Error(errorMessage);
    loginApiCall.mockRejectedValue(apiError);

    const mockToastErrorCallback = vi.fn();

    // 這裡需要讓 toast.promise 能處理 reject 的情況
    toast.promise.mockImplementation((promise, options) => {
      return promise.catch((err) => {
        options.error(err);
        mockToastErrorCallback(err);
      });
    });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/電子郵件/i), "test@example.com");
    await user.type(screen.getByLabelText("密碼"), "Password123");
    await user.click(screen.getByTestId("mock-recaptcha"));

    await user.click(screen.getByRole("button", { name: /登入/i }));

    await waitFor(() => {
      // *測試* 呼叫 toast.promise，並正確回傳錯誤訊息
      expect(toast.promise).toHaveBeenCalled();
      expect(mockToastErrorCallback).toHaveBeenCalledWith(apiError);
    });

    // *測試* 表單是否被重設
    expect(screen.getByLabelText(/電子郵件/i).value).toBe("");
  });
});
