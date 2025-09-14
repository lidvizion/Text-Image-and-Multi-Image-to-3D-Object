import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Terminal, 
  Code, 
  Activity, 
  Copy, 
  Eye, 
  EyeOff,
  ExternalLink 
} from "lucide-react";
import { cn } from "./ui/utils";

interface LogEntry {
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  details?: string;
}

interface ApiCall {
  id: string;
  method: string;
  endpoint: string;
  status: number;
  duration: number;
  timestamp: string;
  request?: any;
  response?: any;
}

interface TechTraceProps {
  logs: LogEntry[];
  apiCalls: ApiCall[];
  isDemo: boolean;
  currentJob?: any;
}

export function TechTrace({ logs, apiCalls, isDemo, currentJob }: TechTraceProps) {
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [selectedCall, setSelectedCall] = useState<string | null>(null);

  const maskApiKey = (key: string) => {
    if (!key) return "YOUR_API_KEY_HERE";
    if (showApiKeys) return key;
    return key.substring(0, 8) + "..." + key.substring(key.length - 4);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-500";
    if (status >= 400) return "text-red-500";
    return "text-yellow-500";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-500";
      case "warning": return "text-yellow-500";
      case "success": return "text-green-500";
      default: return "text-blue-500";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateCurlCommand = () => {
    const apiKey = isDemo ? "demo_key_replace_with_real" : "YOUR_LV_BAAS_API_KEY";
    const workflowId = isDemo ? "demo_workflow_id" : "YOUR_LV_BAAS_WORKFLOW_ID";
    
    return `curl -X POST "https://api.lidvizion.com/v1/workflows/${workflowId}/run" \\
  -H "Authorization: Bearer ${maskApiKey(apiKey)}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "mode": "text",
    "prompt": "A futuristic spaceship",
    "guidance": 7.5,
    "seed": 42
  }'`;
  };

  const generateNodeCode = () => {
    const apiKey = isDemo ? "demo_key_replace_with_real" : "YOUR_LV_BAAS_API_KEY";
    const workflowId = isDemo ? "demo_workflow_id" : "YOUR_LV_BAAS_WORKFLOW_ID";
    
    return `const response = await fetch('https://api.lidvizion.com/v1/workflows/${workflowId}/run', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${maskApiKey(apiKey)}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mode: 'text',
    prompt: 'A futuristic spaceship',
    guidance: 7.5,
    seed: 42
  })
});

const result = await response.json();
console.log('Job ID:', result.job_id);`;
  };

  return (
    <div className="w-96 border-l bg-background">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Tech Trace
            </CardTitle>
            {isDemo && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Demo
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-[calc(100%-5rem)]">
          <Tabs defaultValue="logs" className="h-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none">
              <TabsTrigger value="logs">Run Log</TabsTrigger>
              <TabsTrigger value="api">API Calls</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs" className="h-[calc(100%-2.5rem)] m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="flex items-start gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getLevelColor(log.level))}
                        >
                          {log.level}
                        </Badge>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            {log.timestamp}
                          </p>
                          <p className="text-sm">{log.message}</p>
                          {log.details && (
                            <p className="text-xs text-muted-foreground font-mono">
                              {log.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="api" className="h-[calc(100%-2.5rem)] m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      API Calls ({apiCalls.length})
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKeys(!showApiKeys)}
                      className="h-6 px-2"
                    >
                      {showApiKeys ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  
                  {apiCalls.map((call) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedCall(selectedCall === call.id ? null : call.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {call.method}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getStatusColor(call.status))}
                            >
                              {call.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {call.duration}ms
                          </span>
                        </div>
                        
                        <p className="text-xs font-mono text-muted-foreground">
                          {call.endpoint}
                        </p>
                        
                        <p className="text-xs text-muted-foreground">
                          {call.timestamp}
                        </p>
                        
                        {selectedCall === call.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="space-y-2 pt-2 border-t"
                          >
                            {call.request && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Request:</p>
                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                  {JSON.stringify(call.request, null, 2)}
                                </pre>
                              </div>
                            )}
                            
                            {call.response && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Response:</p>
                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                  {JSON.stringify(call.response, null, 2)}
                                </pre>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="code" className="h-[calc(100%-2.5rem)] m-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm">cURL Command</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(generateCurlCommand())}
                        className="h-6 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      {generateCurlCommand()}
                    </pre>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm">Node.js Example</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(generateNodeCode())}
                        className="h-6 px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      {generateNodeCode()}
                    </pre>
                  </div>
                  
                  {isDemo && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        💡 This is demo mode. Replace the API keys with your actual LV_BAAS_API_KEY and LV_BAAS_WORKFLOW_ID to use live mode.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}