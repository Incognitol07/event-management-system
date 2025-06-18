"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, GraduationCap } from "lucide-react";

interface AttendeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attendeeData: any) => void;
  initialData?: any;
  mode: "create" | "edit";
}

const AttendeeForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: AttendeeFormProps) => {
  const [formData, setFormData] = useState({
    attendeeName: initialData?.attendeeName || "",
    email: initialData?.email || "",
    studentId: initialData?.studentId || "",
    isStudent: initialData?.studentId ? true : false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      studentId: formData.isStudent ? formData.studentId : null,
    };
    onSubmit(submitData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add New Attendee" : "Edit Attendee"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                value={formData.attendeeName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    attendeeName: e.target.value,
                  }))
                }
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isStudent"
                  checked={formData.isStudent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isStudent: e.target.checked,
                      studentId: e.target.checked ? prev.studentId : "",
                    }))
                  }
                  className="rounded"
                />
                <label
                  htmlFor="isStudent"
                  className="text-sm font-medium text-gray-700"
                >
                  This person is a student
                </label>
              </div>

              {formData.isStudent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID *
                  </label>
                  <Input
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        studentId: e.target.value,
                      }))
                    }
                    placeholder="Enter student ID"
                    required={formData.isStudent}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Add Attendee" : "Update Attendee"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { AttendeeForm };
