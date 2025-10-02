"use client";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useDemoStore, DEMO_SCENARIOS } from "@/stores/demo-store";
import { Info, TestTube } from "lucide-react";

export function DemoModeToggle() {
  const {
    isDemoMode,
    currentScenario,
    showDemoIndicators,
    setDemoMode,
    setCurrentScenario,
    toggleDemoIndicators,
    getCurrentScenario
  } = useDemoStore();

  const selectedScenario = getCurrentScenario();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Demo Mode
        </CardTitle>
        <CardDescription>
          Configure demo settings for presentations and testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="demo-mode" className="text-sm font-medium">
            Enable Demo Mode
          </Label>
          <Switch
            id="demo-mode"
            checked={isDemoMode}
            onCheckedChange={setDemoMode}
            aria-describedby="demo-mode-description"
          />
        </div>
        <p id="demo-mode-description" className="text-xs text-muted-foreground">
          Toggle demo mode to use sample data and scenarios for testing
        </p>

        {isDemoMode && (
          <>
            {/* Demo Indicators Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="demo-indicators" className="text-sm font-medium">
                Show Demo Indicators
              </Label>
              <Switch
                id="demo-indicators"
                checked={showDemoIndicators}
                onCheckedChange={toggleDemoIndicators}
                aria-describedby="demo-indicators-description"
              />
            </div>
            <p id="demo-indicators-description" className="text-xs text-muted-foreground">
              Display visual indicators when demo mode is active
            </p>

            {/* Scenario Selection */}
            <div className="space-y-2">
              <Label htmlFor="scenario-select" className="text-sm font-medium">
                Pre-loaded Scenario
              </Label>
              <Select
                value={currentScenario || ""}
                onValueChange={(value) => setCurrentScenario(value || null)}
              >
                <SelectTrigger 
                  id="scenario-select"
                  aria-describedby="scenario-select-description"
                >
                  <SelectValue placeholder="Select a demo scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No scenario selected</SelectItem>
                  {DEMO_SCENARIOS.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            scenario.expectedUrgency === 'emergency' ? 'destructive' :
                            scenario.expectedUrgency === 'high' ? 'destructive' :
                            scenario.expectedUrgency === 'medium' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {scenario.expectedUrgency}
                        </Badge>
                        {scenario.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p id="scenario-select-description" className="text-xs text-muted-foreground">
                Choose a pre-configured scenario to demonstrate different urgency levels
              </p>
            </div>

            {/* Selected Scenario Info */}
            {selectedScenario && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">{selectedScenario.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedScenario.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Location: {selectedScenario.location?.name}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Demo Mode Alert */}
            <Alert className="border-orange-200 bg-orange-50">
              <TestTube className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Demo mode is active. The app will use mock data and pre-loaded scenarios for demonstration purposes.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
}