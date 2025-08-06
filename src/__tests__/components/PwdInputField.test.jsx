import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "./../../components/PwdInputField";
import PwdInputField from "./../../components/PwdInputField";

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

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
}));

describe("PwdInputField 元件測試", async () => {
  const mockRegister = vi.fn();
  const toast = (await import("react-hot-toast")).default;

  beforeEach(() => {
    vi.clearAllMocks();
    toast.error.mockClear();
  });

  // --- 渲染 ---
  describe("UI 渲染測試", () => {
    it("應根據 props 正確渲染 input, label 和 icon", () => {
      const props = {
        icon: "lock",
        label: "密碼",
        name: "password",
        register: mockRegister,
        errors: {},
        showPwdBtn: true,
        showForgotPwdLink: true,
      };

      render(<PwdInputField {...props} />);

      // *測試* input 應顯示在畫面上
      const inputElement = screen.getByLabelText("密碼");
      expect(inputElement).toBeInTheDocument();

      // *測試* input 屬性
      expect(inputElement).toHaveAttribute("name", "password");
      expect(inputElement).toHaveAttribute("placeholder", "密碼");
      expect(inputElement).toHaveAttribute("type", "password");

      // *測試* input-icon 應顯示在畫面上
      const inputIconElement = screen.getByTestId("icon-label");
      expect(inputIconElement).toBeInTheDocument();
      expect(inputIconElement).toHaveAttribute("data-icon-name", "lock");

      // *測試* button 應顯示在畫面上
      const buttonElement = screen.getByRole("button", { name: /顯示密碼/i });
      expect(buttonElement).toBeInTheDocument();

      // *測試* button-icon 應顯示在畫面上
      const buttonIconElement = screen.getByTestId("icon-buttom");
      expect(buttonIconElement).toBeInTheDocument();
      expect(buttonIconElement).toHaveAttribute("data-icon-name", "eye");

      // *測試* link 的文字應顯示在畫面上
      const linkElement = screen.getByRole("link", { name: /忘記密碼?/i });
      expect(linkElement).toBeInTheDocument();
    });

    it("當 showPwdBtn 為 false 時，不應渲染顯示密碼按鈕", () => {
      const props = {
        name: "password",
        register: mockRegister,
        errors: {},
        showPwdBtn: false, // 關鍵 prop
      };

      render(<PwdInputField {...props} />);

      // *測試* 顯示/隱藏密碼的按鈕不應該存在
      const buttonElement = screen.queryByRole("button", {
        name: /顯示密碼|隱藏密碼/i,
      });
      expect(buttonElement).not.toBeInTheDocument();

      // *測試* 當 showPwdBtn 為 false 時，input type 應為 "text"
      const inputElement = screen.getByLabelText("密碼");
      expect(inputElement).toHaveAttribute("type", "text");
    });

    it("當 showForgotPwdLink 為 false 時 (預設行為)，不應渲染忘記密碼連結", () => {
      const props = {
        name: "password",
        register: mockRegister,
        errors: {},
        // showForgotPwdLink 預設值 false
      };

      render(<PwdInputField {...props} />);

      // *測試* 忘記密碼的連結不應該存在
      const linkElement = screen.queryByRole("link", { name: /忘記密碼?/i });
      expect(linkElement).not.toBeInTheDocument();
    });

    it("應正確傳遞 autoComplete 和其他 rest props", () => {
      const props = {
        name: "password",
        register: mockRegister,
        errors: {},
        autoComplete: "current-password",
        className: "custom-class",
      };

      render(<PwdInputField {...props} />);

      const inputElement = screen.getByLabelText("密碼");

      // *測試* autoComplete 屬性
      expect(inputElement).toHaveAttribute("autoComplete", "current-password");

      // *測試* ...rest 傳遞的 className
      expect(inputElement).toHaveClass("custom-class");
    });
  });

  // --- 使用者互動 ---
  describe("使用者互動測試", () => {
    it("當使用者在 input 中輸入密碼時，應能正確更新其值", async () => {
      const props = {
        icon: "lock",
        label: "密碼",
        name: "password",
        register: mockRegister,
        errors: {},
      };

      render(<PwdInputField {...props} />);

      const user = userEvent.setup();

      // *測試* 初始值應為空
      const inputElement = screen.getByLabelText("密碼");
      expect(inputElement).toHaveValue("");

      // *測試* 驗證 input 的值是否已更新
      await user.type(inputElement, "testPassword");
      expect(inputElement).toHaveValue("testPassword");
    });

    it("當使用者點擊 label 時，input 應改成 focus 狀態", async () => {
      const props = {
        icon: "user",
        label: "使用者名稱",
        name: "username",
        register: mockRegister,
        errors: {},
      };
      const user = userEvent.setup();

      render(<PwdInputField {...props} />);

      const inputElement = screen.getByLabelText("使用者名稱");
      const labelElement = screen.getByText("使用者名稱").parentElement;

      // *測試* 確認 input 初始狀態不是 focus
      expect(inputElement).not.toHaveFocus();

      // *測試* 確認點擊 label 後，input 是否為 focus
      await user.click(labelElement);
      expect(inputElement).toHaveFocus();
    });

    it("當使用者點擊按鈕時，應能切換密碼可見性、aria-label 和圖示", async () => {
      const props = {
        icon: "lock",
        label: "密碼",
        name: "password",
        register: mockRegister,
        errors: {},
      };

      render(<PwdInputField {...props} />);

      const user = userEvent.setup();

      const inputElement = screen.getByLabelText("密碼");
      const buttonElement = screen.getByRole("button", { name: /顯示密碼/i });

      // *測試* 按鈕預設狀態
      expect(inputElement).toHaveAttribute("type", "password");
      expect(buttonElement).toHaveAttribute("aria-label", "顯示密碼");
      expect(buttonElement.querySelector("[data-icon-name]")).toHaveAttribute(
        "data-icon-name",
        "eye"
      );

      // *測試* 第一次點擊：顯示密碼
      await user.click(buttonElement);
      expect(inputElement).toHaveAttribute("type", "text");
      expect(buttonElement).toHaveAttribute("aria-label", "隱藏密碼");
      expect(buttonElement.querySelector("[data-icon-name]")).toHaveAttribute(
        "data-icon-name",
        "eye-slash"
      );

      // *測試* 第二次點擊：隱藏密碼
      await user.click(buttonElement);
      expect(inputElement).toHaveAttribute("type", "password");
      expect(buttonElement).toHaveAttribute("aria-label", "顯示密碼");
      expect(buttonElement.querySelector("[data-icon-name]")).toHaveAttribute(
        "data-icon-name",
        "eye"
      );
    });

    it("當使用者點擊「忘記密碼」連結時，應呼叫 toast.error", async () => {
      const user = userEvent.setup();
      const props = {
        name: "password",
        register: mockRegister,
        errors: {},
        showForgotPwdLink: true,
      };

      render(<PwdInputField {...props} />);

      // *測試* toast.error 是否被呼叫
      const linkElement = screen.getByRole("link", { name: /忘記密碼?/i });
      await user.click(linkElement);
      expect(toast.error).toHaveBeenCalledWith("此連結僅限展示，並無實際用途", {
        duration: 2000,
        icon: "👾",
        style: {
          fontWeight: "bold",
          color: "white",
          backgroundColor: "#E8AB61",
        },
      });
      expect(toast.error).toHaveBeenCalledTimes(1);
    });
  });

  // --- 錯誤顯示 ---
  it("當 props 中傳入錯誤訊息時，應顯示該錯誤", async () => {
    const errorMessage = "* 密碼長度不能少於 8 個字元";
    const props = {
      icon: "lock",
      label: "密碼",
      name: "password",
      register: mockRegister,
      errors: {
        password: {
          message: errorMessage,
        },
      },
    };

    render(<PwdInputField {...props} />);

    // *測試* 錯誤訊息應出現在頁面上
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("當 props 中沒有傳入錯誤訊息時，不應顯示錯誤", () => {
    const props = {
      icon: "lock",
      label: "密碼",
      name: "password",
      register: mockRegister,
      errors: {},
    };

    render(<PwdInputField {...props} />);

    // *測試* 錯誤訊息不應出現在頁面上
    const errorMessage = "* 密碼長度不能少於 8 個字元";
    const errorElement = screen.queryByText(errorMessage);
    expect(errorElement).not.toBeInTheDocument();
  });

  // --- 整合測試 (React Hook Form) ---
  it("應使用傳入的 name 呼叫 register 函式", () => {
    const props = {
      icon: "lock",
      label: "密碼",
      name: "password",
      register: mockRegister,
      errors: {},
    };

    render(<PwdInputField {...props} />);

    // *測試* register 函數是否被以正確的 name 調用
    expect(mockRegister).toHaveBeenCalledWith("password");
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });
});
