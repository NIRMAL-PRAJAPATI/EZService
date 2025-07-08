import React, { useEffect, useState } from "react";
import { ChevronDown, WandSparkles, X, } from "lucide-react";
import ServiceProfile from "../components/Explore/ServiceProfile";
import UserReview from "../components/Explore/UserReview";
import UserComp from "../components/Explore/UserComp";
import Announs from "../components/Explore/Announs";
import Header from "../components/Explore/Header";
import ProviderAnno from "../components/Explore/ProviderAnno";
import Loading from '../components/Loading';

const Explore = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [buttonText, setButtonText] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    setTimeout(() => {
      setButtonText(false);
    }, 5000);
  }, [])

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("comment");
  const [commentData, setCommentData] = useState({
    message: "",
    hashtags: [],
    subject: "",
    rating: "",
    provider: "",
  });

  const [complaintData, setComplaintData] = useState({
    message: "",
    subject: "",
    provider: "",
  });

  const [hashtagInput, setHashtagInput] = useState("");

  const isValidHashtag = (tag) => {
    const regex = /^[a-zA-Z0-9]+$/; // Alphanumeric only
    return regex.test(tag);
  };

  const handleAddHashtag = () => {
    const trimmed = hashtagInput.trim();
    if (trimmed && isValidHashtag(trimmed)) {
      setCommentData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, `#${trimmed}`],
      }));
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (tagToRemove) => {
    setCommentData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isMessageValid = complaintData.message.length >= 5 && complaintData.message.length <= 50;

  return (<>{
    isLoading ? <Loading /> :
      <main className=" mx-auto px-4 sm:px-6 lg:px-8 text-black bg-gray-50">
        {/* Filters */}
        <Header />

        {/* Fixed Masonry Grid using CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-3 space-y-3">
          {/* Provider Profile Card */}


          {/* Service Card */}
          <ProviderAnno />
          <ServiceProfile />
          <UserReview />
          <UserComp />
          <Announs />
        </div>

        {/* Load More Button */}
        <div className="my-5 text-center">
          <button
            type="button"
            className="inline-flex items-center text-sm font-medium text-indigo-500 focus:outline-none"
          >
            Load More <ChevronDown />
          </button>
        </div>

        {/* add comment button */}
        <button className="bg-indigo-500 text-white rounded-full shadow-md p-4 flex fixed bottom-6 right-6 animate-scale" onClick={() => setOpen(!open)}>
          <p className={`${buttonText ? "mr-3" : "hidden"} transition-opacity duration-500`}>Post Comment</p>
          <WandSparkles />
        </button>

        {/* Popup Box */}
        {open && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
              aria-label="Close"
            >
              <X className="w-10 h-10 rounded-full bg-red-400 text-white cursor-pointer p-2" />
            </button>
            <div className="relative bg-white rounded-sm shadow-lg w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-5 sm:p-10">

              {/* Tab Switch */}
              <div className="flex mb-4 space-x-2">
                <button
                  onClick={() => setActiveTab("comment")}
                  className={`flex-1 py-2 rounded ${activeTab === "comment"
                    ? "border border-indigo-500 shadow-sm text-indigo-600 bg-indigo-50/30"
                    : "border border-gray-200 text-gray-500"
                    }`}
                >
                  Post Comment
                </button>
                <button
                  onClick={() => setActiveTab("complaint")}
                  className={`flex-1 py-2 rounded ${activeTab === "complaint"
                    ? "border border-indigo-500 shadow-sm text-indigo-600 bg-indigo-50/30"
                    : "border border-gray-200 text-gray-500"
                    }`}
                >
                  Post Complaint
                </button>
              </div>

              {/* Form */}
              <form className=" text-gray-800">
                {/* Provider Selection */}
                <div className="sm:flex gap-2 space-y-3 sm:space-y-0 mb-1">
                  <select
                    name="provider"
                    className="w-full border px-3 py-2 rounded-sm border border-gray-300 outline-none focus:border-indigo-500 text-sm"
                    value={commentData.provider && complaintData.provider}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Provider</option>
                    <option value="provider1">Provider 1</option>
                    <option value="provider2">Provider 2</option>
                  </select>
                  <select
                    name="provider"
                    className="w-full border px-3 py-2 rounded-sm border border-gray-300 outline-none focus:border-indigo-500 text-sm"
                    value={commentData.provider && complaintData.provider}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Provider</option>
                    <option value="provider1">Provider 1</option>
                    <option value="provider2">Provider 2</option>
                  </select>
                </div>

                {/* Comment-specific fields */}
                {activeTab === "comment" && (
                  <>
                    {/* Message */}
                    <label className="text-indigo-500 ml-2 tracking-wide sm:text-sm">Message</label>
                    <textarea
                      name="message"
                      rows="3"
                      placeholder="Your message (5–50 chars)"
                      className="w-full border border-gray-300 border px-3 py-2 outline-none rounded text-sm resize-none"
                      value={commentData.message}
                      onChange={handleChange}
                      required
                    ></textarea>

                    {/* Hashtag input and add button */}
                      <label className="text-indigo-500 ml-2 tracking-wide sm:text-sm">Hastags(#)</label>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="text"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        placeholder="Add hashtag (no spaces or symbols)"
                        className="w-full border border border-gray-300 px-3 py-2 outline-none rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddHashtag}
                        className="bg-indigo-500 text-white px-4 py-2 rounded text-sm hover:bg-indigo-600">Add</button>
                    </div>

                    {/* Display hashtags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {commentData.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs flex tracking-wide items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveHashtag(tag)}
                            className="ml-1 cursor-pointer text-xs text-red-500 hover:text-red-700"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>


                      <label className="text-indigo-500 ml-2 tracking-wide sm:text-sm">Rating</label>
                    <select
                      name="rating"
                      className="w-full border px-3 py-2 border border-gray-300 rounded text-sm"
                      value={commentData.rating}
                      onChange={handleChange}
                    >
                      <option value="">Select Rating</option>
                      <option value="1">⭐</option>
                      <option value="2">⭐⭐</option>
                      <option value="3">⭐⭐⭐</option>
                      <option value="4">⭐⭐⭐⭐</option>
                      <option value="5">⭐⭐⭐⭐⭐</option>
                    </select>
                    <button
                  type="submit"
                  disabled={!commentData.provider}
                  className="w-full bg-indigo-500 text-white border border-gray-300 rounded py-2 mt-2 hover:bg-indigo-600 disabled:opacity-50"
                >
                  Submit Comment
                </button>
                  </>
                )}

                {/* Complaint-specific fields */}
                {activeTab === "complaint" && (
                  <>
                  
                      <label className="text-indigo-500 ml-2 tracking-wide sm:text-sm">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="w-full border px-3 py-2 border border-gray-300 rounded text-sm"
                    value={complaintData.subject}
                    onChange={handleChange}
                  />
                  {/* Message */}
                  
                      <label className="text-indigo-500 ml-2 tracking-wide sm:text-sm">Message</label>
                <textarea
                  name="message"
                  rows="3"
                  placeholder="Your message (5–50 chars)"
                  className="w-full border px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                  value={complaintData.message}
                  onChange={handleChange}
                  required
                ></textarea>

                {!isMessageValid && (
                  <p className="text-red-500 text-xs">Message must be 5–50 characters.</p>
                )}
                <button
                  type="submit"
                  disabled={!isMessageValid || !complaintData.provider}
                  className="w-full bg-indigo-500 text-white rounded py-2 mt-2 hover:bg-indigo-600 disabled:opacity-50"
                >
                  Submit Complaint
                </button>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
      </main>}
  </>
  )
};

export default Explore