import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TodoItem, { Todo } from "@/components/TodoItem";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus, SortAsc, Filter, LogOut } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [sortBy, setSortBy] = useState<"dueDate" | "status">("dueDate");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "active">("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear any stored user data/tokens
    localStorage.clear();
    // Navigate to login page
    navigate("/login");
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      completed: false,
      dueDate: date,
    };

    setTodos([newTodo, ...todos]);
    setTitle("");
    setDescription("");
    setDate(undefined);

    toast({
      title: "Success!",
      description: "Todo added successfully",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      title: "Deleted",
      description: "Todo removed successfully",
    });
  };

  const getSortedAndFilteredTodos = () => {
    let filteredTodos = [...todos];
    
    // Apply filter
    if (filterStatus !== "all") {
      filteredTodos = filteredTodos.filter(todo => 
        filterStatus === "completed" ? todo.completed : !todo.completed
      );
    }
    
    // Apply sort
    return filteredTodos.sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        // Sort by status (completed items at the bottom)
        return Number(a.completed) - Number(b.completed);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto relative">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="absolute top-0 right-0 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Todo title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex flex-col gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !date && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Todo
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex gap-2 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
                Due Date {sortBy === "dueDate" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("status")}>
                Status {sortBy === "status" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All {filterStatus === "all" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active {filterStatus === "active" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                Completed {filterStatus === "completed" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          {getSortedAndFilteredTodos().map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
          {todos.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No todos yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todos;
