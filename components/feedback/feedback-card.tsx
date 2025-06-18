"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Clock, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Feedback {
  id: number;
  eventName: string;
  attendeeName: string;
  rating: number;
  comment: string;
  submittedAt: Date;
  categories: {
    organization: number;
    content: number;
    venue: number;
    overall: number;
  };
}

interface FeedbackCardProps {
  feedback: Feedback;
  onViewDetails?: (feedback: Feedback) => void;
}

const FeedbackCard = ({ feedback, onViewDetails }: FeedbackCardProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 bg-green-50";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const averageRating =
    (feedback.categories.organization +
      feedback.categories.content +
      feedback.categories.venue +
      feedback.categories.overall) /
    4;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {feedback.eventName}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              by {feedback.attendeeName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`text-xs font-medium ${getRatingColor(averageRating)}`}
            >
              <Star className="h-3 w-3 mr-1" />
              {averageRating.toFixed(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="space-y-3"
        onClick={() => onViewDetails?.(feedback)}
      >
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700 line-clamp-3">
            "{feedback.comment}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Organization:</span>
            <span className="font-medium">
              {feedback.categories.organization}/5
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Content:</span>
            <span className="font-medium">{feedback.categories.content}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Venue:</span>
            <span className="font-medium">{feedback.categories.venue}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Overall:</span>
            <span className="font-medium">{feedback.categories.overall}/5</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
          <Clock className="h-3 w-3" />
          <span>Submitted {formatDate(feedback.submittedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export { FeedbackCard };
