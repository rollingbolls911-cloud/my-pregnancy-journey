-- Create table for user-defined custom tasks
CREATE TABLE public.custom_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'morning',
  note TEXT,
  icon TEXT DEFAULT 'Circle',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own custom tasks"
  ON public.custom_tasks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom tasks"
  ON public.custom_tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom tasks"
  ON public.custom_tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom tasks"
  ON public.custom_tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add delete policy for daily_tasks (was missing)
CREATE POLICY "Users can delete their own daily tasks"
  ON public.daily_tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_custom_tasks_updated_at
  BEFORE UPDATE ON public.custom_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();