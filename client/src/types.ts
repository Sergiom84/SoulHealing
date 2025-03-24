// src/types.ts
export type Name = {
    id: number;
    name: string;
    forgiven: boolean | null;
    createdAt: Date | null;
    userId: string;
    exerciseId: number;
  };
  
  export type Note = {
    id: number;
    content: string;
    createdAt: Date | null;
    userId: string;
    exerciseId: number;
  };
  