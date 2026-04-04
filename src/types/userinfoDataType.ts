type UserProfileResponse = {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    businessId: {
      _id: string;
    };
    verified: boolean;
    status: "ACTIVE" | "INACTIVE";
    tokenVersion: number;
    provider: string;
    phoneNumber: string | null;
    deletedAt: string | null;
    loginHistory?: [];
    emailHistory?: [];
    activityLogEvents?: [];
    subscriptions?: [];
    createdAt: string;
    updatedAt: string;
    __v: number;
    avatar: string;
  };
};
