"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, HelpCircle, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  serviceType: z.string().min(1, { message: "Please select a service type" }),
  serviceProvider: z.string().min(1, { message: "Please select a service provider" }),
  complaintType: z.string().min(1, { message: "Please select a complaint type" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
});

export default function ComplaintForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      serviceType: "",
      serviceProvider: "",
      complaintType: "",
      description: "",
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(values);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const nextStep = async () => {
    const fields = step === 1 ? ["name", "email"] : ["serviceType", "serviceProvider", "complaintType"];
    const isValid = await form.trigger(fields);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border-none overflow-hidden">
        <div className="bg-indigo-500 text-white py-4 pl-6">
          <div className="flex items-center">
            <div className="mr-4">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <HelpCircle className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Service Complaint Form</h2>
              <p className="text-white text-opacity-90">Help us improve by sharing your concerns</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {!isSuccess ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-between mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step === i
                          ? "border border-indigo-500 text-indigo-500"
                          : step > i
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {i}
                    </div>
                    <span className={`text-xs mt-1 ${step === i ? "text-indigo-500 font-medium" : "text-gray-500"}`}>
                      {i === 1 ? "Personal Info" : i === 2 ? "Service Details" : "Description"}
                    </span>
                  </div>
                ))}
              </div>

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Your Name</label>
                    <input
                      {...form.register("name")}
                      placeholder="Enter your full name"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {form.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      {...form.register("email")}
                      placeholder="your.email@example.com"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-red-500">error message show here</p>
                    {form.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Type<span className="text-gray-500 text-[11px]"> (Against you want to register complaint)</span></label>
                    <select
                      {...form.register("serviceType")}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select service type
                      </option>
                      <option value="home_servant">Home Servant</option>
                      <option value="car_service">Car Service</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                    {form.formState.errors.serviceType && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.serviceType.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Provider<span className="text-gray-500 text-[11px]"> (Against you want to register complaint)</span></label>
                    <select
                      {...form.register("serviceProvider")}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select service provider
                      </option>
                      <option value="pujara">Pujara Plumbing Service</option>
                      <option value="ananta">Ananta Plumbing Service</option>
                      <option value="omkar">Omkar Hardware</option>
                      <option value="other">Other Provider</option>
                    </select>
                    {form.formState.errors.serviceProvider && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.serviceProvider.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Complaint Type</label>
                    <select
                      {...form.register("complaintType")}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select complaint type
                      </option>
                      <option value="behavior">Misbehavior issue</option>
                      <option value="transaction">Transaction related issue</option>
                      <option value="service">Provided service related issue</option>
                      <option value="other">Something else</option>
                    </select>
                    {form.formState.errors.complaintType && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.complaintType.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                  // See Framer Motion animation docs: https://www.framer.com/docs/animation
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Describe Your Issue</label>
                    <textarea
                      {...form.register("description")}
                      placeholder="Please provide details about your complaint..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm min-h-[150px] resize-none"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Include relevant details such as date, time, and specific concerns
                    </p>
                    {form.formState.errors.description && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Complaint Submitted Successfully</h3>
              <p className="text-gray-600 mb-6">
                Thank you for bringing this to our attention. Our team will review your complaint and get back to you
                within 48 hours.
              </p>
              <p className="text-sm text-gray-500">
                Reference ID:{" "}
                <span className="font-mono font-medium">
                  COMP-
                  {Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, "0")}
                </span>
              </p>
            </motion.div>
          )}
        </div>

        {!isSuccess && (
          <div className="px-6 py-4 bg-gray-100 border-gray-300 border-t flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-500 text-white rounded-sm text-sm font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-sm text-sm font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Complaint
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg p-5 shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-full text-blue-600 mt-1">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">About EZService Complaints</h3>
              <p className="text-gray-600 text-sm">
                At EZService, we take your feedback seriously. Our complaint resolution team works diligently to address
                all concerns within 48 hours. For urgent matters, please contact our customer support at{" "}
                <span className="text-blue-600 font-medium">support@ezservice.com</span> or call
                <span className="text-blue-600 font-medium"> 1-800-EZ-SERVE</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}