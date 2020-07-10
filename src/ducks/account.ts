import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataProvider, Types } from "@stellar/wallet-sdk";
import StellarSdk from "stellar-sdk";
import pick from "lodash/pick";
import { AppDispatch } from "../App";

export const fetchAccount = createAsyncThunk<
  // Return type of the payload creator
  Types.AccountDetails,
  // First argument to the payload creator
  string,
  // Types for ThunkAPI
  { rejectValue: RejectMessage }
>("account/fetchAccount", async (publicKey, { rejectWithValue }) => {
  const dataProvider = new DataProvider({
    // TODO: move to config (support mainnet and testnet) (check everywhere)
    serverUrl: "https://horizon-testnet.stellar.org",
    accountOrKey: publicKey,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  });

  let stellarAccount: Types.AccountDetails | null = null;

  try {
    stellarAccount = await dataProvider.fetchAccountDetails();
  } catch (error) {
    return rejectWithValue({
      errorMessage: error.response?.detail || error.toString(),
    });
  }

  return stellarAccount;
});

interface RejectMessage {
  errorMessage: string;
}

interface InitialState {
  data: Types.AccountDetails | null;
  error?: string;
  loading: boolean;
  // TODO - "any" ?
  pastTransactions: Array<any>;
}

const initialState: InitialState = {
  data: null,
  error: undefined,
  loading: false,
  pastTransactions: [],
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    pastTransactions: (state, action) => ({
      ...state,
      pastTransactions: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      return {
        ...state,
        data: { ...action.payload },
      };
    });

    builder.addCase(fetchAccount.rejected, (state, action) => {
      return {
        ...state,
        error: action.payload?.errorMessage,
      };
    });
  },
});

// TODO - make thunk methods consistent (eg. use createAsyncChunk or not)
// leaving like this to compare
export const fetchAccountTxHistory = (accountId: string) => {
  return async (dispatch: AppDispatch) => {
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
    return (
      server
        .transactions()
        .forAccount(accountId)
        .call()
        // Todo - handle paging
        .then((page: any) => {
          dispatch(
            accountSlice.actions.pastTransactions(
              page.records.map((record: any) =>
                pick(record, ["created_at", "id"]),
              ),
            ),
          );
        })
    );
  };
};

export const { reducer } = accountSlice;
