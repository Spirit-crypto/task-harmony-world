import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const { toast } = useToast();

  const handleToggle = () => {
    onToggle(todo.id);
    if (!todo.completed) {
      toast({
        title: "Task Completed! 🎉",
        description: `"${todo.title}" has been marked as complete.`,
      });
    }
  };

  return (
    <div className="todo-item flex items-center justify-between p-4 bg-card rounded-lg border mb-2">
      <div className="flex items-center space-x-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
        />
        <div>
          <h3 className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
            {todo.title}
          </h3>
          <p className="text-sm text-muted-foreground">{todo.description}</p>
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {format(new Date(todo.dueDate), "PPP")}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(todo.id)}
        className="text-destructive hover:text-destructive"
      >
        Delete
      </Button>
    </div>
  );
};

export default TodoItem;