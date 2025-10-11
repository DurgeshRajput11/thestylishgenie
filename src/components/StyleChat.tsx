import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface StyleChatProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  uploadedImage: string | null;
  analyzing: boolean;
  setAnalyzing: (analyzing: boolean) => void;
}

export const StyleChat = ({ 
  messages, 
  setMessages, 
  uploadedImage, 
  analyzing, 
  setAnalyzing 
}: StyleChatProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (analyzing && messages.length > 0 && messages[messages.length - 1].role === "user") {
      handleSendMessage(false);
    }
  }, [analyzing]);

  const handleSendMessage = async (addUserMessage = true) => {
    if (isLoading) return;
    
    const messageToSend = addUserMessage ? input.trim() : messages[messages.length - 1].content;
    
    if (!messageToSend && addUserMessage) return;

    const newMessages = addUserMessage 
      ? [...messages, { role: "user" as const, content: messageToSend }]
      : messages;

    if (addUserMessage) {
      setMessages(newMessages);
      setInput("");
    }
    
    setIsLoading(true);
    setAnalyzing(false);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-style`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          imageUrl: uploadedImage,
        }),
      });

      if (response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please wait a moment before trying again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (response.status === 402) {
        toast({
          title: "AI usage limit reached",
          description: "Please add credits to continue using AI features.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;

        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              assistantMessage += content;
              setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
            }
          } catch (e) {
            console.error("Parse error:", e);
          }
        }
      }

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get style advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 h-[600px] flex flex-col shadow-luxury bg-gradient-card">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Style Assistant</h3>
          <p className="text-sm text-muted-foreground">Ask me anything about fashion and style</p>
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 pr-4 mb-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-primary/10">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground mb-4">
                  {uploadedImage 
                    ? "I'm analyzing your photo. This will just take a moment..."
                    : "Upload a photo to get started, or ask me a styling question!"}
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Try asking:</p>
                  <p>"What colors suit me best?"</p>
                  <p>"Suggest an outfit for a wedding"</p>
                  <p>"What's my skin undertone?"</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Styling advice coming up...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(true);
            }
          }}
          placeholder="Ask about colors, outfits, or style tips..."
          className="min-h-[60px] resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={() => handleSendMessage(true)}
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
