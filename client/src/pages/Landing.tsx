import { ArrowRight, Calendar, Clock, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import StepItem from "../ui/Item";
import FeatureCard from "../ui/FeatureCard";
import AnimateCard from "../ui/AnimateCard";

const LandingPage = () => {

    const navigate = useNavigate();

    const toggle = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">

            <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

                <AnimateCard>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Book Expert Consultations
                        <span className="block text-gray-600 mt-2">
                            Anytime, Anywhere
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-600">
                        Schedule appointments with professional consultants easily.
                        Choose available time slots and manage bookings in seconds.
                    </p>

                    <div className="mt-8 flex gap-4">

                        <Button onClick={toggle}>
                            Book Now <ArrowRight size={18} />
                        </Button>

                        <Button variant="outline">
                            View Consultants
                        </Button>

                    </div>
                </AnimateCard>

                <AnimateCard
                    className="bg-white p-8 rounded-2xl shadow-lg"
                >
                    <div className="space-y-6">

                        <StepItem
                            icon={Calendar}
                            title="Choose a Date"
                            description="Select your preferred day"
                        />

                        <StepItem
                            icon={Clock}
                            title="Pick a Time Slot"
                            description="Available schedules only"
                        />

                        <StepItem
                            icon={UserCheck}
                            title="Meet Your Consultant"
                            description="Get professional advice"
                        />

                    </div>
                </AnimateCard>

            </section>

            <section className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-6">

                    <h2 className="text-3xl font-bold text-center mb-12">
                        Why Use Our Booking System
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">

                        <FeatureCard
                            icon={Calendar}
                            title="Easy Scheduling"
                            description="Quickly book available time slots without complicated steps."
                        />

                        <FeatureCard
                            icon={Clock}
                            title="Real-Time Availability"
                            description="Only see time slots that consultants actually have open."
                        />

                        <FeatureCard
                            icon={UserCheck}
                            title="Professional Experts"
                            description="Connect with trusted consultants ready to help you."
                        />

                    </div>

                </div>
            </section>

            <section className="py-20">
                <div className="max-w-4xl mx-auto text-center px-6">

                    <h2 className="text-3xl font-bold mb-4">
                        Start Booking Your Consultation Today
                    </h2>

                    <p className="text-gray-600 mb-8">
                        Find the right consultant and reserve your time slot in seconds.
                    </p>

                    <div className="flex justify-center">
                        <Button
                            onClick={toggle}
                            className="px-8 py-4"
                        >
                            Get Started
                        </Button>
                    </div>

                </div>
            </section>

        </div>
    );
}

export default LandingPage