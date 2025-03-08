"use client";
/* eslint-disable */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Clipboard, Coffee, FileText, Home, MessageSquare, Users, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  // State for form data
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: ''
  });
  
  // State for task list
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Lunch slot booking', description: 'Book your lunch slot for today', priority: 'high', deadline: 'Today 12:00 PM' },
    { id: 2, title: 'Diwali email', description: 'Complete an email to send for Diwali', priority: 'medium', deadline: 'Tomorrow 10:00 AM' },
    { id: 3, title: 'BOAT event preparation', description: 'Prepare materials for the upcoming BOAT event', priority: 'medium', deadline: '3 days' }
  ]);
  
  // State for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle priority selection change
  const handlePriorityChange = (value: string) => {
    setNewTask(prev => ({ ...prev, priority: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim() === '') return;
    
    const newTaskItem = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      deadline: newTask.deadline || 'No deadline'
    };
    
    setTasks(prev => [newTaskItem, ...prev]);
    setNewTask({ title: '', description: '', priority: 'medium', deadline: '' });
    setIsDialogOpen(false);
  };
  
  // Handle task deletion
  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-pink-600">Worklio</h1>
          <div className="hidden md:flex space-x-4">
            <button className="px-3 py-2 rounded-md text-sm font-medium text-pink-600 bg-pink-50">Your Dashboard</button>
            
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-500 hover:text-pink-600">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-medium">AT</div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">HEY THERE!</h1>
            <p className="text-gray-600">You have {tasks.length} tasks pending today</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-500 hover:bg-pink-600">
                <Plus size={18} className="mr-2" /> Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a new task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      placeholder="Enter task title" 
                      value={newTask.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Enter task description" 
                      rows={3}
                      value={newTask.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={newTask.priority} 
                        onValueChange={handlePriorityChange}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input 
                        id="deadline" 
                        name="deadline" 
                        type="datetime-local" 
                        value={newTask.deadline}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-pink-500 hover:bg-pink-600">Add Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance Card */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Attendance</CardTitle>
              <Button variant="ghost" className="text-xs text-pink-600 hover:text-pink-700 p-0">View Stats</Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Total check-ins</span>
                  <span className="text-sm font-medium">1,434 / 1,500</span>
                </div>
                <Progress className="h-2 bg-pink-100" value={95.6}>
                  <div className="bg-pink-500 h-full rounded-full"></div>
                </Progress>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">1,031</span>
                  </div>
                  <span className="text-xs text-gray-500">on time</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">403</span>
                  </div>
                  <span className="text-xs text-gray-500">late attendance</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">66</span>
                  </div>
                  <span className="text-xs text-gray-500">not present</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-green-600">15% more than Wednesday</span>
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Documents status</CardTitle>
              <Button variant="ghost" className="text-xs text-pink-600 hover:text-pink-700 p-0">View Stats</Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Total documents</span>
                  <span className="text-sm font-medium">244</span>
                </div>
                <Progress className="h-2 bg-pink-100" value={90.5}>
                  <div className="bg-pink-500 h-full rounded-full"></div>
                </Progress>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">221</span>
                  </div>
                  <span className="text-xs text-gray-500">signed by all</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">23</span>
                  </div>
                  <span className="text-xs text-gray-500">documents unsigned by all</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">169</span>
                  </div>
                  <span className="text-xs text-gray-500">users have not signed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Card */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Checklist</CardTitle>
              <Badge className="bg-red-500 text-white text-xs py-1">{tasks.length} Pending</Badge>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="high">High Priority</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group relative">
                      <div className={`
                        h-5 w-5 rounded-full flex-shrink-0 mt-0.5
                        ${task.priority === 'high' ? 'bg-red-100 text-red-500' : 
                          task.priority === 'medium' ? 'bg-orange-100 text-orange-500' : 
                          'bg-green-100 text-green-500'
                        }
                      `}>
                        <div className="h-2 w-2 rounded-full bg-current m-1.5"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{task.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{task.deadline}</span>
                      <button 
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="high" className="space-y-4">
                  {tasks.filter(task => task.priority === 'high').map(task => (
                    <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group relative">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-red-500 m-1.5"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{task.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{task.deadline}</span>
                      <button 
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="completed" className="p-4 text-center text-gray-500 text-sm">
                  No completed tasks yet
                </TabsContent>
              </Tabs>
              <Button 
                className="w-full mt-4 bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus size={16} className="mr-2" /> Add New Task
              </Button>
            </CardContent>
          </Card>

          {/* Parking Grid */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Live Contributions</CardTitle>
             
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                
                {/* Basement 02 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Yearly</h3>
                    <span className="text-xs text-gray-500">81/144</span>
                  </div>
                  <div className="h-1 w-full bg-pink-100 rounded-full">
                    <div className="h-1 bg-pink-500 rounded-full" style={{width: '56%'}}></div>
                  </div>
                  <div className="grid grid-cols-12 gap-1 mt-3">
                    {Array(48).fill(0).map((_, i) => (
                      <div 
                        key={`b2-${i}`} 
                        className={`h-4 rounded-sm ${i % 5 === 0 || i % 7 === 0 ? 'bg-pink-500' : 'bg-gray-200'}`}
                      ></div>
                    ))}
                  </div>
                </div>
                
               
              </div>
            </CardContent>
          </Card>

          {/* Meeting Rooms Card */}
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Meeting rooms</CardTitle>
              <Badge className="bg-green-500 text-white text-xs py-1">Available</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold">24</h3>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-bold">12</h3>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">Book a Meeting Room</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Book a meeting room</DialogTitle>
                  </DialogHeader>
                  <form>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="roomName">Select a Room</Label>
                        <Select defaultValue="conference-a">
                          <SelectTrigger id="roomName">
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conference-a">Conference Room A</SelectItem>
                            <SelectItem value="conference-b">Conference Room B</SelectItem>
                            <SelectItem value="meeting-1">Meeting Room 1</SelectItem>
                            <SelectItem value="meeting-2">Meeting Room 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="meetingTitle">Meeting Title</Label>
                        <Input id="meetingTitle" placeholder="Enter meeting title" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input id="startTime" type="datetime-local" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input id="endTime" type="datetime-local" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="attendees">Attendees</Label>
                        <Input id="attendees" placeholder="Enter email addresses" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-pink-500 hover:bg-pink-600">Book Room</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;