"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

type ProjectDetailProps = {
  id: string;
};

export const ProjectDetail = ({ id }: ProjectDetailProps) => {
  useEffect(() => {
    const fetchProjectDetail = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("projects")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        console.error(error);
        return;
      }
      console.log(data);
    };

    fetchProjectDetail();
  }, [id]);

  return <></>;
};
