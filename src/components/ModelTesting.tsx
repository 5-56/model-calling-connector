
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface ModelTestingProps {
  modelName: string;
  apiUrl: string;
  apiKey: string;
}

const ModelTesting = ({ modelName, apiUrl, apiKey }: ModelTestingProps) => {
  const [input, setInput] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!modelName || !apiUrl || !apiKey) {
      toast({
        title: "Missing Configuration",
        description: "Please fill in all model configuration fields.",
        variant: "destructive",
      });
      return;
    }

    if (!input.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter some text to process.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: "user", content: input }],
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResponse(data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2));
      
      toast({
        title: "Success",
        description: "Response received successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from the model.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl animate-slideIn">
      <CardHeader>
        <CardTitle className="text-2xl font-light">Test Model</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter your prompt here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px] transition-all duration-200 hover:border-gray-400 focus:border-gray-500"
          />
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit'
          )}
        </Button>
        {response && (
          <div className="space-y-2 animate-fadeIn">
            <div className="font-medium text-sm text-gray-500">Response:</div>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelTesting;
