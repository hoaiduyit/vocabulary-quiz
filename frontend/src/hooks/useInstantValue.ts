import { useEffect, useRef } from "react";

export function useInstantValue<T>(value: T) {
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}
