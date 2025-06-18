"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedbackData: any) => void;
  eventName: string;
  eventId: number;
}

const FeedbackForm = ({
  isOpen,
  onClose,
  onSubmit,
  eventName,
  eventId,
}: FeedbackFormProps) => {
  const [formData, setFormData] = useState({
    attendeeName: "",
    email: "",
    organization: 0,
    content: 0,
    venue: 0,
    overall: 0,
    comment: "",
    suggestions: "",
    wouldRecommend: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      eventId,
      eventName,
      submittedAt: new Date(),
    });
    onClose();
  };

  const StarRating = ({
    rating,
    onRatingChange,
    label,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 transition-colors ${
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
          >
            <Star className="h-5 w-5 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Feedback for ${eventName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <Input
                  value={formData.attendeeName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      attendeeName: e.target.value,
                    }))
                  }
                  placeholder="Enter your name"
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
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Rate Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StarRating
              label="Event Organization"
              rating={formData.organization}
              onRatingChange={(rating) =>
                setFormData((prev) => ({ ...prev, organization: rating }))
              }
            />
            <StarRating
              label="Content Quality"
              rating={formData.content}
              onRatingChange={(rating) =>
                setFormData((prev) => ({ ...prev, content: rating }))
              }
            />
            <StarRating
              label="Venue & Facilities"
              rating={formData.venue}
              onRatingChange={(rating) =>
                setFormData((prev) => ({ ...prev, venue: rating }))
              }
            />
            <StarRating
              label="Overall Experience"
              rating={formData.overall}
              onRatingChange={(rating) =>
                setFormData((prev) => ({ ...prev, overall: rating }))
              }
            />
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Your Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What did you think about the event?
              </label>
              <Textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Share your thoughts about the event..."
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suggestions for improvement (optional)
              </label>
              <Textarea
                value={formData.suggestions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    suggestions: e.target.value,
                  }))
                }
                placeholder="How can we make future events better?"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="wouldRecommend"
                checked={formData.wouldRecommend}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    wouldRecommend: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <label
                htmlFor="wouldRecommend"
                className="text-sm font-medium text-gray-700"
              >
                I would recommend this event to others
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Submit Feedback</Button>
        </div>
      </form>
    </Modal>
  );
};

export { FeedbackForm };
