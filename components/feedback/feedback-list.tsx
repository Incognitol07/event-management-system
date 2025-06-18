"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedbackCard } from "./feedback-card";
import {
  MessageSquare,
  Star,
  TrendingUp,
  Filter,
  Download,
  BarChart3,
} from "lucide-react";

// Mock feedback data
const mockFeedback = [
  {
    id: 1,
    eventName: "AI in Education Symposium",
    attendeeName: "Sarah Johnson",
    rating: 4.5,
    comment:
      "Excellent event with great speakers and networking opportunities. The content was very relevant and well-presented.",
    submittedAt: new Date("2025-06-15"),
    categories: {
      organization: 5,
      content: 4,
      venue: 4,
      overall: 5,
    },
  },
  {
    id: 2,
    eventName: "Student Orientation",
    attendeeName: "Mike Chen",
    rating: 3.8,
    comment:
      "Good overall experience, but the venue was a bit crowded. Information was helpful for new students.",
    submittedAt: new Date("2025-06-14"),
    categories: {
      organization: 4,
      content: 4,
      venue: 3,
      overall: 4,
    },
  },
  {
    id: 3,
    eventName: "Faculty Meeting",
    attendeeName: "Dr. Emily Rodriguez",
    rating: 4.2,
    comment:
      "Well-organized meeting with clear agenda. Could use better time management for discussions.",
    submittedAt: new Date("2025-06-13"),
    categories: {
      organization: 4,
      content: 4,
      venue: 5,
      overall: 4,
    },
  },
];

const FeedbackList = () => {
  const [feedback, setFeedback] = useState(mockFeedback);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");

  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.attendeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const averageRating =
      (item.categories.organization +
        item.categories.content +
        item.categories.venue +
        item.categories.overall) /
      4;

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "high" && averageRating >= 4) ||
      (ratingFilter === "medium" && averageRating >= 3 && averageRating < 4) ||
      (ratingFilter === "low" && averageRating < 3);

    return matchesSearch && matchesRating;
  });

  // Calculate overall statistics
  const totalFeedback = feedback.length;
  const averageRating =
    feedback.reduce((sum, item) => {
      const itemAverage =
        (item.categories.organization +
          item.categories.content +
          item.categories.venue +
          item.categories.overall) /
        4;
      return sum + itemAverage;
    }, 0) / totalFeedback;

  const satisfactionRate =
    (feedback.filter((item) => {
      const itemAverage =
        (item.categories.organization +
          item.categories.content +
          item.categories.venue +
          item.categories.overall) /
        4;
      return itemAverage >= 4;
    }).length /
      totalFeedback) *
    100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Feedback</h1>
          <p className="text-gray-600">
            Collect and analyze feedback from event attendees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Feedback
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalFeedback}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  Average Rating
                </p>
                <p className="text-2xl font-bold text-yellow-900">
                  {averageRating.toFixed(1)}/5
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Satisfaction Rate
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {satisfactionRate.toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  This Month
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {
                    feedback.filter(
                      (f) =>
                        new Date(f.submittedAt).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as any)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Ratings</option>
            <option value="high">High (4+ stars)</option>
            <option value="medium">Medium (3-4 stars)</option>
            <option value="low">Low (&lt; 3 stars)</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedback.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No feedback found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Feedback will appear here as attendees submit reviews."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedback.map((item) => (
            <FeedbackCard key={item.id} feedback={item} />
          ))}
        </div>
      )}

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["organization", "content", "venue", "overall"].map((category) => {
              const categoryAverage =
                feedback.reduce(
                  (sum, item) =>
                    sum +
                    item.categories[category as keyof typeof item.categories],
                  0
                ) / feedback.length;

              return (
                <div
                  key={category}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900 capitalize">
                    {category}
                  </h4>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-lg font-bold">
                      {categoryAverage.toFixed(1)}
                    </span>
                    <span className="text-gray-500">/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { FeedbackList };
