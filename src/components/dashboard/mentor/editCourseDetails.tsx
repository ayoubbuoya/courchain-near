import { useStore } from "@/app/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONTRACTID } from "@/lib/config";
import { FullCourse } from "@/lib/types";
import { fromNearToYocto, fromYoctoToNear } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";

export default function EditCourseDetails({ course }: { course: FullCourse }) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [price, setPrice] = useState(fromYoctoToNear(course.price));
  const { wallet, signedAccountId } = useStore();

  const handleUpdateCourseDetails = async () => {
    const loadingToast = toast.loading("Updating course details...");
    try {
      console.log("Price in yocto", fromNearToYocto(price));
      const response = await wallet.callMethod({
        contractId: CONTRACTID,
        method: "update_course_details",
        args: {
          course_id: course.id,
          title,
          description,
          price: fromNearToYocto(price),
          updated_at: new Date().getTime(),
        },
      });

      const success = Boolean(
        Buffer.from(response.status.SuccessValue, "base64").toString(
          "utf-8"
        ) === "true"
      );

      if (!success) {
        toast.update(loadingToast, {
          type: "error",
          render: "An error occurred while updating course details",
          autoClose: 1000,
          isLoading: false,
        });
      }

      toast.update(loadingToast, {
        type: "success",
        render: "Course details updated successfully",
        autoClose: 1000,
        isLoading: false,
      });

      // refresh the page
        setTimeout(() => {
            window.location.reload();
        }, 500);

    } catch (error) {
      console.error(error);
      toast.update(loadingToast, {
        type: "error",
        render: "An error occurred while updating course details",
        autoClose: 1000,
        isLoading: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-aqua-blue outline-aqua-blue text-white rounded-full px-5 py-2 font-poppins duration-700 font-normal text-[0.88rem] leading-5 text-center hover:bg-white hover:text-aqua-blue hover:border hover:border-aqua-blue ">
          Edit Course Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[38%]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium capitalize text-aqua-blue font-poppins ">
            Edit course details
          </DialogTitle>
          <DialogDescription className="text-schemes-secondary">
            Make changes to your course details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label
              htmlFor="title"
              className="text-base font-normal text-right text-aqua-blue font-poppins "
            >
              Course Title
            </Label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 outline-aqua-blue py-3 border border-aqua-blue rounded-lg px-3 font-poppins font-normal text-[0.8rem] leading-5 text-schemes-primary"
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label
              htmlFor="description"
              className="text-base font-normal text-right text-aqua-blue font-poppins "
            >
              Description
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 outline-aqua-blue py-3 border border-aqua-blue rounded-lg px-3 font-poppins font-normal text-[0.8rem] leading-5 text-schemes-primary"
            />
          </div>
          {/* Price Field */}
          <div className="grid items-center grid-cols-4 gap-4">
            <Label
              htmlFor="price"
              className="text-base font-normal text-right text-aqua-blue font-poppins "
            >
              Course Price
            </Label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="col-span-3 outline-aqua-blue py-3 border border-aqua-blue rounded-lg px-3 font-poppins font-normal text-[0.8rem] leading-5 text-schemes-primary"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleUpdateCourseDetails}
            className=" bg-aqua-blue outline-aqua-blue text-white rounded-lg px-5 py-2 font-poppins font-normal text-[0.88rem] leading-5 duration-700 text-center hover:bg-white hover:text-aqua-blue hover:border hover:border-aqua-blue"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
