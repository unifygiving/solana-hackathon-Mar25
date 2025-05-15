import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined | null;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  lat?: Maybe<Scalars['Float']['output']>;
  lng?: Maybe<Scalars['Float']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Beneficiary = {
  __typename?: 'Beneficiary';
  donations_received: Scalars['Float']['output'];
  email: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
};

/**
 * Cache behavior for ApolloServer
 * https://www.apollographql.com/docs/apollo-server/performance/caching
 */
export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Charity = {
  __typename?: 'Charity';
  address: Address;
  beneficiaries: Array<CharityUser>;
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  mission?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sector?: Maybe<CharitySector>;
  website?: Maybe<Scalars['String']['output']>;
};


export type CharityBeneficiariesArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export enum CharitySector {
  Animals = 'animals',
  Charity = 'charity',
  UgPartner = 'ug_partner'
}

export type CharityUser = {
  __typename?: 'CharityUser';
  email: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
};

export type Donation = {
  __typename?: 'Donation';
  amount: Scalars['BigInt']['output'];
  created_at: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  payment_id?: Maybe<Scalars['String']['output']>;
  receipt_addr?: Maybe<Scalars['String']['output']>;
  status: DonationStatus;
  type: DonationType;
};

export enum DonationStatus {
  Cancelled = 'cancelled',
  Completed = 'completed',
  Paid = 'paid',
  Pending = 'pending'
}

export enum DonationType {
  Crypto = 'crypto',
  Fiat = 'fiat'
}

export type Donor = {
  __typename?: 'Donor';
  donations?: Maybe<Array<Donation>>;
  donations_given: Scalars['Float']['output'];
  email: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
};

export type Mcfile = {
  __typename?: 'Mcfile';
  donations_given: Scalars['Float']['output'];
  donations_received: Scalars['Float']['output'];
  email: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
  role: RoleType;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBeneficiary?: Maybe<CharityUser>;
  createCharity?: Maybe<Charity>;
  createCryptoDonation: Donation;
  createDonor: Donor;
  createPayment: Payment;
  cryptoPaymentCompleted: PaymentCompletedResult;
  deleteDonor: Scalars['Boolean']['output'];
  login?: Maybe<AuthPayload>;
  logout: Scalars['Boolean']['output'];
  processPayment: Payment;
  updateDonor: Donor;
  updatePaymentStatus: Payment;
};


export type MutationCreateBeneficiaryArgs = {
  charityId: Scalars['ID']['input'];
  detail: NewCharityBeneficiary;
};


export type MutationCreateCharityArgs = {
  detail: NewCharity;
};


export type MutationCreateCryptoDonationArgs = {
  amountInLamports: Scalars['Int']['input'];
  beneficiaryId: Scalars['Int']['input'];
  tokenCode: Scalars['String']['input'];
};


export type MutationCreateDonorArgs = {
  input: NewDonorInput;
};


export type MutationCreatePaymentArgs = {
  input: NewPaymentInput;
};


export type MutationCryptoPaymentCompletedArgs = {
  donationId: Scalars['String']['input'];
  txHash: Scalars['String']['input'];
};


export type MutationDeleteDonorArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationProcessPaymentArgs = {
  paymentId: Scalars['ID']['input'];
};


export type MutationUpdateDonorArgs = {
  id: Scalars['Int']['input'];
  input: NewDonorInput;
};


export type MutationUpdatePaymentStatusArgs = {
  id: Scalars['ID']['input'];
  status: PaymentStatus;
};

export type NewCharity = {
  charityAdmin: NewCharityAdmin;
  description: Scalars['String']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  location: InputAddress;
  mission?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sector: CharitySector;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type NewCharityAdmin = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type NewCharityBeneficiary = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  story?: InputMaybe<Scalars['String']['input']>;
};

export type NewDonorInput = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type NewPaymentInput = {
  amount: Scalars['Float']['input'];
  currency: Scalars['String']['input'];
  donation_id: Scalars['ID']['input'];
  method: PaymentMethod;
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  created_at: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  donation_id: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
};

export type PaymentCompletedResult = {
  __typename?: 'PaymentCompletedResult';
  assetKey: Scalars['String']['output'];
  signature: Scalars['String']['output'];
};

export enum PaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  CreditCard = 'CREDIT_CARD',
  Cryptocurrency = 'CRYPTOCURRENCY',
  Paypal = 'PAYPAL'
}

export enum PaymentStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

export type Query = {
  __typename?: 'Query';
  beneficiary: CharityUser;
  charities: Array<Charity>;
  donations: Array<Maybe<Donation>>;
  donor?: Maybe<Donor>;
  donors: Array<Donor>;
  payment?: Maybe<Payment>;
  payments: Array<Payment>;
};


export type QueryBeneficiaryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCharitiesArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryDonationsArgs = {
  donorId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryDonorArgs = {
  id: Scalars['Int']['input'];
};


export type QueryDonorsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPaymentsArgs = {
  donationId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<PaymentStatus>;
};

export enum RoleType {
  Admin = 'admin',
  Charity = 'charity',
  Donor = 'donor',
  Recipient = 'recipient'
}

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
  role: RoleType;
};

export type InputAddress = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  postcode?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Address: ResolverTypeWrapper<Address>;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Beneficiary: ResolverTypeWrapper<Beneficiary>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CacheControlScope: CacheControlScope;
  Charity: ResolverTypeWrapper<Charity>;
  CharitySector: CharitySector;
  CharityUser: ResolverTypeWrapper<CharityUser>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Donation: ResolverTypeWrapper<Donation>;
  DonationStatus: DonationStatus;
  DonationType: DonationType;
  Donor: ResolverTypeWrapper<Donor>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mcfile: ResolverTypeWrapper<Mcfile>;
  Mutation: ResolverTypeWrapper<{}>;
  NewCharity: NewCharity;
  NewCharityAdmin: NewCharityAdmin;
  NewCharityBeneficiary: NewCharityBeneficiary;
  NewDonorInput: NewDonorInput;
  NewPaymentInput: NewPaymentInput;
  Payment: ResolverTypeWrapper<Payment>;
  PaymentCompletedResult: ResolverTypeWrapper<PaymentCompletedResult>;
  PaymentMethod: PaymentMethod;
  PaymentStatus: PaymentStatus;
  Query: ResolverTypeWrapper<{}>;
  RoleType: RoleType;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<User>;
  inputAddress: InputAddress;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Address;
  AuthPayload: AuthPayload;
  Beneficiary: Beneficiary;
  BigInt: Scalars['BigInt']['output'];
  Boolean: Scalars['Boolean']['output'];
  Charity: Charity;
  CharityUser: CharityUser;
  DateTime: Scalars['DateTime']['output'];
  Donation: Donation;
  Donor: Donor;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mcfile: Mcfile;
  Mutation: {};
  NewCharity: NewCharity;
  NewCharityAdmin: NewCharityAdmin;
  NewCharityBeneficiary: NewCharityBeneficiary;
  NewDonorInput: NewDonorInput;
  NewPaymentInput: NewPaymentInput;
  Payment: Payment;
  PaymentCompletedResult: PaymentCompletedResult;
  Query: {};
  String: Scalars['String']['output'];
  Upload: Scalars['Upload']['output'];
  User: User;
  inputAddress: InputAddress;
};

export type CacheControlDirectiveArgs = {
  inheritMaxAge?: Maybe<Scalars['Boolean']['input']>;
  maxAge?: Maybe<Scalars['Int']['input']>;
  scope?: Maybe<CacheControlScope>;
};

export type CacheControlDirectiveResolver<Result, Parent, ContextType = any, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lng?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  postcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BeneficiaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Beneficiary'] = ResolversParentTypes['Beneficiary']> = {
  donations_received?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type CharityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Charity'] = ResolversParentTypes['Charity']> = {
  address?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  beneficiaries?: Resolver<Array<ResolversTypes['CharityUser']>, ParentType, ContextType, RequireFields<CharityBeneficiariesArgs, 'limit' | 'offset'>>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  mission?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sector?: Resolver<Maybe<ResolversTypes['CharitySector']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CharityUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['CharityUser'] = ResolversParentTypes['CharityUser']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DonationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Donation'] = ResolversParentTypes['Donation']> = {
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payment_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  receipt_addr?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['DonationStatus'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DonationType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DonorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Donor'] = ResolversParentTypes['Donor']> = {
  donations?: Resolver<Maybe<Array<ResolversTypes['Donation']>>, ParentType, ContextType>;
  donations_given?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type McfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mcfile'] = ResolversParentTypes['Mcfile']> = {
  donations_given?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  donations_received?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['RoleType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createBeneficiary?: Resolver<Maybe<ResolversTypes['CharityUser']>, ParentType, ContextType, RequireFields<MutationCreateBeneficiaryArgs, 'charityId' | 'detail'>>;
  createCharity?: Resolver<Maybe<ResolversTypes['Charity']>, ParentType, ContextType, RequireFields<MutationCreateCharityArgs, 'detail'>>;
  createCryptoDonation?: Resolver<ResolversTypes['Donation'], ParentType, ContextType, RequireFields<MutationCreateCryptoDonationArgs, 'amountInLamports' | 'beneficiaryId' | 'tokenCode'>>;
  createDonor?: Resolver<ResolversTypes['Donor'], ParentType, ContextType, RequireFields<MutationCreateDonorArgs, 'input'>>;
  createPayment?: Resolver<ResolversTypes['Payment'], ParentType, ContextType, RequireFields<MutationCreatePaymentArgs, 'input'>>;
  cryptoPaymentCompleted?: Resolver<ResolversTypes['PaymentCompletedResult'], ParentType, ContextType, RequireFields<MutationCryptoPaymentCompletedArgs, 'donationId' | 'txHash'>>;
  deleteDonor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDonorArgs, 'id'>>;
  login?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  processPayment?: Resolver<ResolversTypes['Payment'], ParentType, ContextType, RequireFields<MutationProcessPaymentArgs, 'paymentId'>>;
  updateDonor?: Resolver<ResolversTypes['Donor'], ParentType, ContextType, RequireFields<MutationUpdateDonorArgs, 'id' | 'input'>>;
  updatePaymentStatus?: Resolver<ResolversTypes['Payment'], ParentType, ContextType, RequireFields<MutationUpdatePaymentStatusArgs, 'id' | 'status'>>;
};

export type PaymentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  donation_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  method?: Resolver<ResolversTypes['PaymentMethod'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['PaymentStatus'], ParentType, ContextType>;
  transaction_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentCompletedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentCompletedResult'] = ResolversParentTypes['PaymentCompletedResult']> = {
  assetKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  beneficiary?: Resolver<ResolversTypes['CharityUser'], ParentType, ContextType, RequireFields<QueryBeneficiaryArgs, 'id'>>;
  charities?: Resolver<Array<ResolversTypes['Charity']>, ParentType, ContextType, RequireFields<QueryCharitiesArgs, 'limit' | 'offset'>>;
  donations?: Resolver<Array<Maybe<ResolversTypes['Donation']>>, ParentType, ContextType, Partial<QueryDonationsArgs>>;
  donor?: Resolver<Maybe<ResolversTypes['Donor']>, ParentType, ContextType, RequireFields<QueryDonorArgs, 'id'>>;
  donors?: Resolver<Array<ResolversTypes['Donor']>, ParentType, ContextType, RequireFields<QueryDonorsArgs, 'limit' | 'offset'>>;
  payment?: Resolver<Maybe<ResolversTypes['Payment']>, ParentType, ContextType, RequireFields<QueryPaymentArgs, 'id'>>;
  payments?: Resolver<Array<ResolversTypes['Payment']>, ParentType, ContextType, Partial<QueryPaymentsArgs>>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['RoleType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Address?: AddressResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Beneficiary?: BeneficiaryResolvers<ContextType>;
  BigInt?: GraphQLScalarType;
  Charity?: CharityResolvers<ContextType>;
  CharityUser?: CharityUserResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Donation?: DonationResolvers<ContextType>;
  Donor?: DonorResolvers<ContextType>;
  Mcfile?: McfileResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  PaymentCompletedResult?: PaymentCompletedResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
};
