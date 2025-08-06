import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaField = forwardRef(({ control, name, errors }, ref) => {
  return (
    <div>
      <div className="flex justify-center">
        <Controller
          data-testid="mock-recaptcha"
          name={name}
          control={control}
          render={({ field }) => (
            <ReCAPTCHA
              onChange={field.onChange}
              ref={ref}
              sitekey="6LdcQoUrAAAAAE5xIrwWCxdIbqI9v1Y7c4CUtGIe"
              hl="zh-TW"
            />
          )}
        />
      </div>
      {errors[name] && (
        <p className="ml-12 mt-1 text-xs text-red-600">
          {errors[name].message}
        </p>
      )}
    </div>
  );
});

export default RecaptchaField;
