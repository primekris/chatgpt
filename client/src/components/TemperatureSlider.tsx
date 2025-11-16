import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
  return (
    <div className="space-y-3 px-4 py-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Temperature</Label>
        <span className="text-sm font-mono text-muted-foreground">{value.toFixed(1)}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0}
        max={1.2}
        step={0.1}
        data-testid="slider-temperature"
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Precise</span>
        <span>Creative</span>
      </div>
    </div>
  );
}
