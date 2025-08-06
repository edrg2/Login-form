import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputField from "../../components/InputField";

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

describe("InputField 元件測試", () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("應根據 props 正確渲染 input, label 和 icon", () => {
    const props = {
      icon: "user",
      label: "使用者名稱",
      name: "username",
      register: mockRegister,
      errors: {},
    };

    render(<InputField {...props} />);

    // *測試* 透過 label 尋找 input
    const inputElement = screen.getByLabelText("使用者名稱");
    expect(inputElement).toBeInTheDocument();

    // *測試* input 屬性
    expect(inputElement).toHaveAttribute("name", "username");
    expect(inputElement).toHaveAttribute("placeholder", "使用者名稱");
    expect(inputElement).toHaveAttribute("type", "text");

    // *測試* icon 圖示是否在頁面上
    const iconElement = screen.getByTestId("icon-username");
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute("data-icon-name", "user");
  });

  it("應正確傳遞 autoComplete 和其他 rest props", () => {
    const props = {
      icon: "envlope",
      label: "使用者名稱",
      name: "email",
      type: "email",
      register: mockRegister,
      errors: {},
      autoComplete: "email",
      className: "custom-class",
    };

    render(<InputField {...props} />);

    const inputElement = screen.getByLabelText("使用者名稱");

    // *測試* input 的 type 是否為傳入的 'email'
    expect(inputElement).toHaveAttribute("type", "email");

    // *測試* autoComplete 屬性
    expect(inputElement).toHaveAttribute("autoComplete", "email");

    // *測試* ...rest 傳遞的 className
    expect(inputElement).toHaveClass("custom-class");
  });

  // --- 使用者互動 ---
  it("當使用者在 input 中輸入文字時，應能正確更新其值", async () => {
    const props = {
      icon: "user",
      label: "使用者名稱",
      name: "username",
      register: mockRegister,
      errors: {},
    };
    const user = userEvent.setup();

    render(<InputField {...props} />);

    const inputElement = screen.getByLabelText("使用者名稱");

    // *測試* 初始值應為空
    expect(inputElement).toHaveValue("");

    // *測試* 驗證 input 的值是否已更新
    await user.type(inputElement, "testUser");
    expect(inputElement).toHaveValue("testUser");
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

    render(<InputField {...props} />);

    const inputElement = screen.getByLabelText("使用者名稱");
    const labelElement = screen.getByText("使用者名稱").parentElement;

    // *測試* 確認 input 初始狀態不是 focus
    expect(inputElement).not.toHaveFocus();

    // *測試* 確認點擊 label 後，input 是否為 focus
    await user.click(labelElement);
    expect(inputElement).toHaveFocus();
  });

  // --- 錯誤訊息顯示 ---
  it("當 props 中傳入錯誤訊息時，應顯示該錯誤", () => {
    const errorMessage = "* 電子郵件格式不正確";
    const props = {
      icon: "envelope",
      label: "電子郵件",
      name: "email",
      register: mockRegister,
      errors: {
        email: {
          message: errorMessage,
        },
      },
    };

    render(<InputField {...props} />);

    // *測試* 錯誤訊息應出現在頁面上
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("當 props 中沒有傳入錯誤訊息時，不應顯示錯誤", () => {
    const props = {
      icon: "envelope",
      label: "電子郵件",
      name: "email",
      register: mockRegister,
      errors: {},
    };

    render(<InputField {...props} />);

    // *測試* 錯誤訊息不應出現在頁面上
    const errorMessage = "* 電子郵件格式不正確";
    const errorElement = screen.queryByText(errorMessage);
    expect(errorElement).not.toBeInTheDocument();
  });

  // --- 整合測試 (React Hook Form) ---
  it("應使用傳入的 name 呼叫 register 函式", () => {
    const props = {
      icon: "envelope",
      label: "密碼",
      name: "email", // 使用一個特定的 name 來驗證
      register: mockRegister,
      errors: {},
    };

    render(<InputField {...props} />);

    // *測試* register 函數是否被以正確的 name 調用
    expect(mockRegister).toHaveBeenCalledWith("email");
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });
});
