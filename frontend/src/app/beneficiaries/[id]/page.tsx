"use client";

import * as React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Alert,
  Paper,
  Modal,
  Card,
  CardMedia,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EditIcon from "@mui/icons-material/Edit";
import AppBar from "@/components/AppBar";
import { useAuthStore } from "@/store/authStore";
import { useDonationStore } from "@/store/donationStore";
import { GET_BENEFICIARY } from "@/lib/queries/beneficiary-queries";
import { CREATE_CRYPTO_DONATION } from "@/lib/mutations/payment-mutations";
import PaymentComponent from "@/components/payment/PaymentComponent";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { NotFoundState } from "@/components/ui/NotFoundState";
import { BeneficiaryInfo } from "@/components/beneficiary/BeneficiaryInfo";
import {
  CryptoDonationResult,
  FormData,
  FormErrors,
} from "@/types/beneficiary";
import "@dialectlabs/blinks/index.css";

import {
  Blink,
  useBlink,
  useBlinksRegistryInterval,
} from "@dialectlabs/blinks";
import { useBlinkSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { useWallet } from "@solana/wallet-adapter-react";

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "#111",
  border: "2px solid #333",
  boxShadow: 24,
  p: 4,
  color: "white",
  borderRadius: 2,
};

export default function BeneficiaryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  // const beneficiaryId = parseInt(id);

  const [beneficiaryId, setBeneficiaryId] = React.useState<number>(0);

  React.useEffect(() => {
    // If id is "0", extract it from the URL
    if (id === "0") {
      // Get the current URL path
      const path = window.location.pathname;
      // Extract the ID from the URL
      const urlId = path.split("/").pop();
      if (urlId && !isNaN(parseInt(urlId))) {
        setBeneficiaryId(parseInt(urlId));
      } else {
        // Handle case where URL doesn't contain a valid ID
        console.error("No valid ID found in URL");
        router.push("/charities");
      }
    } else {
      // Use the ID passed from params
      setBeneficiaryId(parseInt(id));
    }
  }, [id, router]);
  // URL of your endpoint (blink provider)
  // const blinkApiUrl =
  //   "https://bonkblinks.com/api/actions/lock?_brf=a0898550-e7ec-408d-b721-fca000769498&_bin=ffafbecd-bb86-435a-8722-e45bf139eab5";
  const blinkApiUrl =
    "https://solana-hackathon-mar25.onrender.com/solana-actions/3";
  // Initiates adapter
  const { adapter } = useBlinkSolanaWalletAdapter(
    "https://api.mainnet-beta.solana.com"
  );

  // Fetches the blink from the provided URL
  const { blink, isLoading } = useBlink({ url: blinkApiUrl });

  const { user, isAuthenticated } = useAuthStore();
  const { startDonation, completeDonation, resetDonation } = useDonationStore();

  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [formErrors, setFormErrors] = React.useState<FormErrors>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [donationId, setDonationId] = React.useState("");
  const [donationInProgress, setDonationInProgress] = React.useState(false);

  // New state for modal
  const [openDonateModal, setOpenDonateModal] = React.useState(false);

  // Track if a donation was just completed to prevent re-triggering
  const justCompletedRef = React.useRef(false);

  const handleOpenModal = () => {
    // Reset donation state when opening the modal
    resetDonation();
    justCompletedRef.current = false;
    setDonationInProgress(false);
    setOpenDonateModal(true);
  };

  const handleCloseModal = () => {
    // Don't reset if we're in the middle of processing
    if (!donationInProgress) {
      resetDonation();
    }
    setOpenDonateModal(false);
  };

  const { data, loading, error, refetch } = useQuery(GET_BENEFICIARY, {
    variables: { beneficiaryId2: beneficiaryId },
    fetchPolicy: "network-only",
  });

  const [createCryptoDonation] = useMutation(CREATE_CRYPTO_DONATION);

  React.useEffect(() => {
    if (data?.beneficiary) {
      setFormData({
        first_name: data.beneficiary.first_name,
        last_name: data.beneficiary.last_name,
        email: data.beneficiary.email,
      });
    }
  }, [data]);

  const isAdmin = () => {
    if (!isAuthenticated || !user) return false;
    return user.role === "admin";
  };

  const canEdit = () => {
    if (!isAuthenticated || !user) return false;
    if (user.role === "admin") return true;
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { first_name: "", last_name: "", email: "" };
    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
      isValid = false;
    }
    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      // await updateBeneficiary({ variables: { id: beneficiaryId, detail: formData } });
      setSuccessMessage("Beneficiary successfully updated!");
      setIsEditMode(false);
      refetch();
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error updating beneficiary";
      setErrorMessage(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this beneficiary? This action cannot be undone."
      )
    )
      return;
    setIsDeleting(true);
    try {
      // await deleteBeneficiary({ variables: { id: beneficiaryId } });
      router.push("/charities");
    } catch (error: unknown) {
      setIsDeleting(false);
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting beneficiary";
      setErrorMessage(errorMessage);
    }
  };

  const handleCancel = () => {
    if (data?.beneficiary) {
      setFormData({
        first_name: data.beneficiary.first_name,
        last_name: data.beneficiary.last_name,
        email: data.beneficiary.email,
      });
    }
    setIsEditMode(false);
    setFormErrors({ first_name: "", last_name: "", email: "" });
  };

  const handleGoBack = () => router.push("/charities");

  const handleInitiateDonation = () => {
    setDonationInProgress(true);
    startDonation(beneficiaryId, 0); // Amount will be set in PaymentComponent
  };

  const handleDonationComplete = async (
    signature: string,
    lamports: number
  ) => {
    try {
      // Only process if we haven't just completed this donation
      if (justCompletedRef.current) {
        return;
      }

      justCompletedRef.current = true;
      completeDonation(signature, lamports);

      const result = await createCryptoDonation({
        variables: {
          beneficiaryId,
          amountInLamports: lamports,
          tokenCode: "USD",
        },
      });

      // Properly access the id from the typed result
      const donationId = (result.data as CryptoDonationResult)
        ?.createCryptoDonation?.id;

      if (donationId) {
        setDonationId(donationId);
        setSuccessMessage("Donation successfully processed!");

        // Clean up and close modal
        setDonationInProgress(false);
        handleCloseModal();

        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        throw new Error("Failed to get donation ID from server response");
      }
    } catch (error: unknown) {
      setDonationInProgress(false);
      justCompletedRef.current = false;

      const errorMessage =
        error instanceof Error ? error.message : "Error processing donation";
      setErrorMessage(errorMessage);
    }
  };

  if (loading) return <LoadingState handleGoBack={handleGoBack} />;
  if (error) return <ErrorState error={error} handleGoBack={handleGoBack} />;
  if (!data?.beneficiary) return <NotFoundState handleGoBack={handleGoBack} />;

  const beneficiary = data.beneficiary;
  const userCanEdit = canEdit();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AppBar />
      </Box>

      <Container
        maxWidth="lg"
        sx={{ color: "white", px: { xs: 2, sm: 3 }, pb: 8 }}
      >
        <Box sx={{ my: 4 }}>
          <Button
            startIcon={<ChevronLeftIcon />}
            onClick={handleGoBack}
            sx={{ color: "white", mb: 3 }}
          >
            Back to Charities
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
              {`${beneficiary.first_name} ${beneficiary.last_name}`}
            </Typography>
            {userCanEdit && !isEditMode && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => setIsEditMode(true)}
              >
                Edit
              </Button>
            )}
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Left Side: Image */}
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: "#111", borderRadius: 2, height: "100%" }}>
                <CardMedia
                  component="img"
                  height="100" // <-- This fixed height is the issue
                  image="https://images.unsplash.com/photo-1444212477490-ca407925329e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={`${beneficiary.first_name} ${beneficiary.last_name}`}
                  sx={{
                    objectFit: "cover",
                    // Add height: '100%' to the sx prop of CardMedia
                    height: "100%",
                  }}
                />
              </Card>
              {/* <Blink blink={blink} adapter={adapter} /> */}
            </Grid>

            {/* Right Side: Beneficiary Info with Donate Button Below */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    backgroundColor: "#111",
                    color: "white",
                    mb: 3,
                    flexGrow: 1,
                  }}
                >
                  <BeneficiaryInfo
                    beneficiary={beneficiary}
                    isEditMode={isEditMode}
                    formData={formData}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    handleDelete={handleDelete}
                    isAdmin={isAdmin}
                    isDeleting={isDeleting}
                    donationId={donationId}
                  />
                </Paper>

                {/* Donate Button */}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderRadius: 2,
                  }}
                  onClick={handleOpenModal}
                >
                  Donate Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Donation Modal */}
      <Modal
        open={openDonateModal}
        onClose={handleCloseModal}
        aria-labelledby="donation-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography
            id="donation-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 3 }}
          >
            Donate to {beneficiary.first_name} {beneficiary.last_name}
          </Typography>

          <PaymentComponent
            beneficiaryId={beneficiaryId}
            onInitiateDonation={handleInitiateDonation}
            onDonationComplete={handleDonationComplete}
            onCancel={handleCloseModal}
          />
        </Box>
      </Modal>
    </Box>
  );
}
