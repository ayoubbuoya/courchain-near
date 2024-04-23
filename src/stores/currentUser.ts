import { Course, User, FullCourse } from "@/lib/types";
import { create as createStore } from "zustand";

export const useCurrentUserStore = createStore<{
  currentUser: User | null;
  setCurrentUser: (currentUser: User | null) => void;
  cartedCourses: Course[] | null;
  setCartedCourses: (cartedCourses: Course[] | null) => void;
  enrolledCourses: FullCourse[] | null;
  setEnrolledCourses: (enrolledCourses: FullCourse[] | null) => void;
}>((set) => ({
  currentUser: null,
  setCurrentUser: (currentUser) => set({ currentUser }),
  cartedCourses: null,
  setCartedCourses: (cartedCourses) => set({ cartedCourses }),
  enrolledCourses: null,
  setEnrolledCourses: (enrolledCourses) => set({ enrolledCourses }),
}));
