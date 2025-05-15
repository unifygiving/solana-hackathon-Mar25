"use client";

import React, { useEffect, useRef, ReactNode, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Charity } from "../../data/data";
import { useMap } from "@/context/map-context";
// Import the mutation but we'll use it differently
import { CREATE_BENEFICIARY } from "@/graphql/beneficiary-mutations";

interface MapPopUpProps {
  charity?: Charity;
  onClose: () => void;
  // Add these new props
  children?: ReactNode;
  latitude?: number;
  longitude?: number;
  offset?: number;
  closeButton?: boolean;
  closeOnClick?: boolean;
  className?: string;
  focusAfterOpen?: boolean;
}

const realBeneficiariesData = [
  {
    id: 101,
    first_name: "Aisha",
    last_name: "Khan",
    email: "aisha.k@charityserve.org",
    date_of_birth: "1985-07-21",
    program: "Skills Training Program",
    enrollment_date: "2023-10-15",
    status: "Active",
    contact_number: "+1-555-123-4567",
    address: {
      street: "123 Community Way",
      city: "Metropolis",
      country: "USA",
    },
    notes: "Requires transportation assistance for sessions.",
  },
  {
    id: 102,
    first_name: "David",
    last_name: "Chen",
    email: "david.c@hopefund.net",
    date_of_birth: "1992-03-10",
    program: "Emergency Shelter",
    enrollment_date: "2024-01-20",
    status: "Inactive - Housed",
    contact_number: "+1-555-987-6543",
    address: null,
    notes: "Successfully moved into transitional housing.",
  },
  {
    id: 103,
    first_name: "Maria",
    last_name: "Garcia",
    email: "maria.g@literacyproject.org",
    date_of_birth: "2015-11-05",
    program: "Children's Reading Program",
    enrollment_date: "2023-09-01",
    status: "Active",
    contact_number: "+1-555-246-8109",
    address: {
      street: "456 Oak Avenue",
      city: "Villagetown",
      country: "USA",
    },
    guardian_name: "Sofia Garcia",
    notes: "Showing significant improvement in reading level.",
  },
  {
    id: 104,
    first_name: "Samuel",
    last_name: "Okoye",
    email: "samuel.o@healthforall.org",
    date_of_birth: "1958-06-18",
    program: "Medical Assistance Program",
    enrollment_date: "2024-03-10",
    status: "Active",
    contact_number: "+1-555-112-3344",
    address: {
      street: "789 Pine Lane",
      city: "Townsville",
      country: "USA",
    },
    medical_condition: "Diabetes",
    notes: "Requires regular check-ups and medication.",
  },
];

// In the future, you'll want to add this code to properly integrate with Apollo Client
// Add this comment at the top of your file to remind yourself how to implement it
/*
  APOLLO CLIENT INTEGRATION:
  
  To properly use Apollo Client with this component:
  
  1. Import useMutation: 
     import { useMutation } from "@apollo/client";
     
  2. Initialize inside a React component that has access to ApolloProvider:
     const [createBeneficiary, { loading, error }] = useMutation(CREATE_BENEFICIARY);
     
  3. Call the mutation:
     const result = await createBeneficiary({
       variables: { 
         charityId: charity.id, 
         detail: beneficiaryData 
       }
     });
     
  4. This component currently uses a mock implementation to avoid React Context errors
     when the popup renders outside the React tree.
*/
interface Beneficiary {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

// Define input for creating a beneficiary
interface NewCharityBeneficiary {
  first_name: string;
  last_name: string;
  email: string;
  // Add any other required fields
}

const MapPopUp: React.FC<MapPopUpProps> = ({
  charity,
  onClose,
  children,
  latitude,
  longitude,
  offset = 0,
  closeButton = true,
  closeOnClick = false,
  className = "",
  focusAfterOpen = true,
}) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const { map } = useMap();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [showBeneficiaries, setShowBeneficiaries] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // We'll handle the mutation directly instead of using useMutation hook
  // This avoids the useContext error in non-React rendering environments

  // Add console logs for debugging
  console.log("MapPopUp rendering with charity:", charity);

  const handleDonateClick = async (charity: Charity) => {
    console.log("Donate button clicked for:", charity.name);

    // Toggle beneficiaries list visibility
    setShowBeneficiaries(!showBeneficiaries);
  };

  // This function will handle creating a new beneficiary
  const handleAddBeneficiary = async (charity: Charity) => {
    // In a real app, this would use your Apollo client instance
    // But for now, we'll just simulate adding a beneficiary to avoid the Context error
    setLoading(true);

    try {
      // Create mock beneficiary for demonstration
      const newBeneficiary: Beneficiary = {
        id: Math.floor(Math.random() * 1000), // Generate random ID
        first_name: "New",
        last_name: "Beneficiary",
        email: `user${Date.now()}@example.com`,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Add to beneficiaries state
      setBeneficiaries((prev) => [...prev, newBeneficiary]);
      setLoading(false);

      console.log("Beneficiary added:", newBeneficiary);
      return newBeneficiary;
    } catch (err) {
      console.error("Error creating beneficiary:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setLoading(false);
      throw err;
    }
  };

  // Function to render beneficiaries list
  const renderBeneficiaryList = () => {
    if (loading) return <div className="text-sm">Loading beneficiaries...</div>;
    if (error)
      return <div className="text-sm text-red-500">Error: {error.message}</div>;

    return (
      <div className="mt-3 max-h-40 overflow-y-auto">
        <h3 className="font-bold text-sm mb-2">Beneficiaries:</h3>
        {beneficiaries.length === 0 ? (
          <p className="text-sm text-gray-500">No beneficiaries yet</p>
        ) : (
          <ul className="text-sm">
            {beneficiaries.map((ben) => (
              <li key={ben.id} className="border-b border-gray-200 py-1">
                {ben.first_name} {ben.last_name} - {ben.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  useEffect(() => {
    // Only create popup if map exists and either charity or coordinates are provided
    if (
      !map ||
      (!charity && (latitude === undefined || longitude === undefined))
    ) {
      console.log("Map or location data missing, not creating popup");
      return;
    }

    if (charity) {
      console.log("Creating popup for charity:", charity.name);
    } else {
      console.log("Creating popup for coordinates:", latitude, longitude);
    }

    // Remove any existing popup first to prevent multiple popups
    if (popupRef.current) {
      console.log("Removing existing popup");
      popupRef.current.remove();
      popupRef.current = null;
    }

    // Determine coordinates to use
    const lat = latitude !== undefined ? latitude : charity?.latitude || 0;
    const lng = longitude !== undefined ? longitude : charity?.longitude || 0;

    // Create the popup with specific options to keep it open
    popupRef.current = new mapboxgl.Popup({
      closeButton,
      closeOnClick,
      maxWidth: "350px", // Increased width to accommodate the beneficiary list
      className: `charity-popup-container ${className}`,
      anchor: "bottom",
      offset,
      focusAfterOpen,
    });

    if (children) {
      // If children are provided, use them as content
      const container = document.createElement("div");

      // Use ReactDOM to render children
      const ReactDOM = require("react-dom");
      ReactDOM.render(children, container);

      // Set the content and position
      popupRef.current
        .setLngLat([lng, lat])
        .setDOMContent(container)
        .addTo(map);
    } else if (charity) {
      // Create a container for dynamic content
      const popupContainer = document.createElement("div");
      popupContainer.className = "charity-popup";

      // Render initial popup content
      const renderPopupContent = () => {
        // Generate the list items as an HTML string
        const beneficiariesListHtml = realBeneficiariesData
          .map(
            (ben) => `
          <li class="border-b border-gray-200 py-1">
            <a
              href="https://solana-hackathon-mar25.vercel.app/charities/1"
              target="_blank"
              rel="noopener noreferrer" class="text-blue-600 hover:underline"
            >
              ${ben.first_name} ${ben.last_name} - ${ben.email} </a>
          </li>
        `
          )
          .join(""); // Join the array of strings into a single string

        popupContainer.innerHTML = `
          <div class="p-3 max-w-xs">
            <div class="font-bold text-lg mb-2">${charity.name}</div>
            <div class="text-sm mb-2">${charity.description}</div>
            <div class="flex items-center mb-2">
              <div class="flex">
                ${Array.from({ length: 5 })
                  .map(
                    (_, i) =>
                      `<span class="text-${i < Math.floor(charity.rating) ? "yellow" : "gray"}-500 mr-0.5">★</span>`
                  )
                  .join("")}
              </div>
              <span class="text-sm text-gray-600 ml-1">${charity.rating}</span>
            </div>
            <div class="text-xs text-gray-500 mb-2">
              <i class="fas fa-map-marker-alt mr-1"></i>
              ${charity.location}
            </div>
            <div class="text-xs font-medium text-purple-600">
              ${charity.impact}
            </div>
            <div class="mt-3">
              <button id="donate-button" class="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors w-full">
                ${showBeneficiaries ? "Hide Beneficiaries" : "Show Beneficiaries"}
              </button>
            </div>
            <div id="beneficiaries-container" class="${showBeneficiaries ? "" : "hidden"}">
              ${
                showBeneficiaries
                  ? `
                    <div class="mt-3 max-h-40 overflow-y-auto">
                      <h3 class="font-bold text-sm mb-2">Beneficiaries:</h3>
                      ${loading ? '<div class="text-sm">Loading beneficiaries...</div>' : ""}
                      ${error ? `<div class="text-sm text-red-500">Error: ${error.message}</div>` : ""}
                      ${
                        // Only include the list HTML string if not loading and no error
                        !loading && !error
                          ? `
                            <ul class="text-sm">
                              ${beneficiariesListHtml} </ul>
                          `
                          : ""
                      }
                      ${
                        // Optional: Message if the hardcoded list is empty
                        !loading && !error && realBeneficiariesData.length === 0
                          ? '<div class="text-sm text-gray-600">No beneficiaries hardcoded.</div>'
                          : ""
                      }
                    </div>
                    <div class="mt-3">
                      <button id="add-beneficiary" class="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors w-full">
                        Add Beneficiary
                      </button>
                    </div>
                  `
                  : ""
              }
            </div>
          </div>
        `;

        // Add event listener for the donate/toggle button
        const donateButton = popupContainer.querySelector("#donate-button");
        if (donateButton) {
          donateButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            setShowBeneficiaries(!showBeneficiaries);
            // Re-render the popup content to show/hide beneficiaries
            renderPopupContent(); // Call itself to update the DOM
          });
        }

        // Add event listener for the add beneficiary button
        const addBeneficiaryButton =
          popupContainer.querySelector("#add-beneficiary");
        if (addBeneficiaryButton) {
          addBeneficiaryButton.addEventListener("click", async (e) => {
            e.stopPropagation(); // Prevent event from bubbling up

            try {
              // Call your helper function
              const newBeneficiary = await handleAddBeneficiary(charity);
              // Note: handleAddBeneficiary needs to update the *data source*
              // (e.g., the hardcodedBeneficiaries array, though changing const is bad)
              // and then you need to call renderPopupContent() again to show the change.
              // Modifying a const array like hardcodedBeneficiaries is problematic.
              // A real solution would update a mutable variable or fetch fresh data.

              // Assuming handleAddBeneficiary updates some shared mutable state or you refetch/redefine data:
              renderPopupContent(); // Re-render the popup content
            } catch (err) {
              console.error("Error creating beneficiary:", err);
              // You could show an error message by updating the popup content string
            }
          });
        }

        // IMPORTANT: If you want links inside the beneficiary list to do something
        // other than just navigate (e.g., trigger a function), you would need
        // to add event listeners to those links *after* setting innerHTML as well.
        // This is complex and reinforces why this approach is difficult compared to React.
      };

      // Initial render
      renderPopupContent();

      // Set the content and position
      popupRef.current
        .setLngLat([lng, lat])
        .setDOMContent(popupContainer)
        .addTo(map);
    }

    console.log("Popup added to map");

    // Add event listener for popup close button
    const closeHandler = () => {
      console.log("Popup closed via close button");
      if (onClose) onClose();
    };

    popupRef.current.on("close", closeHandler);

    // Fly to the location with animation - PRESERVING THIS AS REQUESTED
    // Enhance the fly-to animation with more dynamic parameters
    if (charity) {
      map.flyTo({
        center: [charity.longitude, charity.latitude],
        zoom: 15,
        essential: true,
        duration: 1500, // Slightly longer for more dramatic effect
        pitch: 60, // Add some pitch for a 3D effect
        bearing: Math.random() * 60 - 30, // Random slight bearing for variety
        curve: 1.5, // Add a more pronounced curve to the animation
      });
    } else if (latitude !== undefined && longitude !== undefined) {
      map.flyTo({
        center: [lng, lat],
        zoom: 15,
        essential: true,
        duration: 1000,
      });
    }

    // Prevent map click from interfering with popup
    const mapClickHandler = (e: mapboxgl.MapMouseEvent) => {
      // Prevent map clicks from closing the popup
      e.originalEvent.stopPropagation();
    };

    map.on("click", mapClickHandler);

    // Cleanup function
    return () => {
      console.log("Cleaning up popup");
      if (popupRef.current) {
        // Remove the event listener before removing the popup
        popupRef.current.off("close", closeHandler);
        popupRef.current.remove();
        popupRef.current = null;
      }

      // Remove map click handler
      map.off("click", mapClickHandler);
    };
  }, [
    map,
    charity,
    children,
    latitude,
    longitude,
    offset,
    closeButton,
    closeOnClick,
    className,
    focusAfterOpen,
    onClose,
    showBeneficiaries,
    beneficiaries,
    loading,
    error,
  ]);

  // This component doesn't render anything directly
  return null;
};

export default MapPopUp;
