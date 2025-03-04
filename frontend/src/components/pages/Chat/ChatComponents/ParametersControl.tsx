"use client";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  setMaxTokens,
  setTemperature,
  setTopP,
} from "@/redux/features/chatSlice/chatSlice";

const ParametersControl = () => {
  const dispatch = useAppDispatch();
  const { temperature, topP, maxTokens } = useAppSelector(
    (state) => state.chat
  );

  // Format value to single decimal place for display
  const formatValue = (value: number) => value.toFixed(1);

  return (
    <div className="flex flex-col gap-4 border border-[var(--card-border)] rounded-md p-4 bg-[var(--card-bg-secondary)]">
      <h3 className="font-medium text-sm mb-2">Generation Parameters</h3>

      {/* Temperature Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="temperature" className="text-sm">
            Temperature
          </label>
          <span className="text-xs px-2 py-1 bg-[var(--muted)] rounded-md">
            {formatValue(temperature)}
          </span>
        </div>
        <input
          id="temperature"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => dispatch(setTemperature(parseFloat(e.target.value)))}
          className="w-full h-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>1</span>
          <span>2</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Higher values produce more random outputs
        </p>
      </div>

      {/* Top P Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="topP" className="text-sm">
            Top P
          </label>
          <span className="text-xs px-2 py-1 bg-[var(--muted)] rounded-md">
            {formatValue(topP)}
          </span>
        </div>
        <input
          id="topP"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={topP}
          onChange={(e) => dispatch(setTopP(parseFloat(e.target.value)))}
          className="w-full h-2 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>0.5</span>
          <span>1</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Controls diversity via nucleus sampling
        </p>
      </div>

      {/* Max Tokens Input */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="maxTokens" className="text-sm">
            Max Tokens
          </label>
        </div>
        <input
          id="maxTokens"
          type="number"
          min="1"
          max="4096"
          value={maxTokens}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0) {
              dispatch(setMaxTokens(value));
            }
          }}
          className="w-full p-2 border border-[var(--card-border)] rounded-md bg-[var(--input-bg)] text-[var(--input-text)]"
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum length of generated response
        </p>
      </div>
    </div>
  );
};

export default ParametersControl;
