// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { fetchAccount, clearCurrentAccount } from "./accountSlice";
// import { formatCurrency, formatLabel, STAGE_COLORS } from "../../constants";
// import Spinner from "../../components/Spinner";
// import Avatar from "../../components/Avatar";
// import DetailField from "../../components/DetailField";
// import {
//   BuildingOffice2Icon,
//   PencilSquareIcon,
//   PhoneIcon,
//   GlobeAltIcon,
//   UserGroupIcon,
//   CurrencyRupeeIcon,
//   ArrowLeftIcon,
// } from "@heroicons/react/24/outline";

// const AccountDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { account, detailLoading } = useSelector((s) => s.accounts);

//   useEffect(() => {
//     dispatch(fetchAccount(id));
//     return () => dispatch(clearCurrentAccount());
//   }, [dispatch, id]);

//   if (detailLoading || !account) {
//     return <Spinner className="py-20" />;
//   }

//   const statCards = [
//     { icon: PhoneIcon, label: "Phone", value: account.phone || "—" },
//     { icon: GlobeAltIcon, label: "Website", value: account.website || "—" },
//     { icon: UserGroupIcon, label: "Employees", value: account.employees?.toLocaleString("en-IN") || "—" },
//     { icon: CurrencyRupeeIcon, label: "Revenue", value: formatCurrency(account.annualRevenue) },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/accounts")}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
//           </button>
          
//           {/* Account Image or Icon */}
//           {account.image ? (
//             <img 
//               src={account.image} 
//               alt={account.accountName}
//               className="w-14 h-14 rounded-xl object-cover"
//             />
//           ) : (
//             <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
//               <BuildingOffice2Icon className="w-7 h-7 text-blue-600" />
//             </div>
//           )}
          
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{account.accountName}</h1>
//             <p className="text-sm text-gray-500">
//               {account.accountNumber} · Owner: {account.owner?.name}
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={() => navigate(`/accounts/${id}/edit`)}
//           className="btn-primary"
//         >
//           <PencilSquareIcon className="w-5 h-5 mr-1.5" />
//           Edit
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {statCards.map((stat) => (
//               <div key={stat.label} className="card text-center py-4">
//                 <stat.icon className="w-5 h-5 text-gray-400 mx-auto mb-2" />
//                 <p className="text-xs text-gray-500">{stat.label}</p>
//                 <p className="font-semibold text-sm mt-0.5 truncate px-2">{stat.value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Details */}
//           <div className="card">
//             <h2 className="section-title mb-4">Account Details</h2>
//             <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//               <DetailField label="Type" value={formatLabel(account.accountType)} />
//               <DetailField label="Industry" value={account.industry} />
//               <DetailField label="Rating" value={account.rating} />
//               <DetailField label="Ownership" value={account.ownership} />
//               <DetailField label="Parent Account" value={account.parentAccount?.accountName} />
//             </div>
//           </div>

//           {/* Addresses */}
//           <div className="card">
//             <h2 className="section-title mb-4">Addresses</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-sm font-medium text-gray-500 mb-2">Billing Address</p>
//                 <p className="text-sm text-gray-700">
//                   {[
//                     account.billingStreet,
//                     account.billingCity,
//                     account.billingState,
//                     account.billingPincode,
//                     account.billingCountry,
//                   ]
//                     .filter(Boolean)
//                     .join(", ") || "—"}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500 mb-2">Shipping Address</p>
//                 <p className="text-sm text-gray-700">
//                   {[
//                     account.shippingStreet,
//                     account.shippingCity,
//                     account.shippingState,
//                     account.shippingPincode,
//                     account.shippingCountry,
//                   ]
//                     .filter(Boolean)
//                     .join(", ") || "—"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Deals */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="section-title">Deals ({account.deals?.length || 0})</h2>
//               <button
//                 onClick={() => navigate(`/deals/new?accountId=${id}`)}
//                 className="link text-sm"
//               >
//                 + Add Deal
//               </button>
//             </div>
//             {account.deals?.length > 0 ? (
//               <div className="space-y-2">
//                 {account.deals.map((deal) => (
//                   <Link
//                     key={deal.id}
//                     to={`/deals/${deal.id}`}
//                     className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
//                   >
//                     <div>
//                       <p className="font-medium text-sm">{deal.dealName}</p>
//                       <p className="text-xs text-gray-500">{deal.owner?.name}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-sm">{formatCurrency(deal.amount)}</p>
//                       <span className={`badge text-[10px] ${STAGE_COLORS[deal.stage] || "badge-gray"}`}>
//                         {formatLabel(deal.stage)}
//                       </span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400 text-sm text-center py-6">No deals yet</p>
//             )}
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Contacts */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="section-title">Contacts ({account.contacts?.length || 0})</h2>
//               <button
//                 onClick={() => navigate(`/contacts/new?accountId=${id}`)}
//                 className="link text-sm"
//               >
//                 + Add
//               </button>
//             </div>
//             {account.contacts?.length > 0 ? (
//               <div className="space-y-2">
//                 {account.contacts.map((contact) => (
//                   <Link
//                     key={contact.id}
//                     to={`/contacts/${contact.id}`}
//                     className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
//                   >
//                     <Avatar
//                       name={contact.firstName}
//                       secondName={contact.lastName}
//                       size="sm"
//                       image={contact.image}
//                     />
//                     <div className="min-w-0">
//                       <p className="font-medium text-sm truncate">
//                         {contact.firstName} {contact.lastName || ""}
//                       </p>
//                       <p className="text-xs text-gray-500 truncate">{contact.email}</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400 text-sm text-center py-6">No contacts yet</p>
//             )}
//           </div>

//           {/* Child Accounts */}
//           {account.childAccounts?.length > 0 && (
//             <div className="card">
//               <h2 className="section-title mb-4">Child Accounts</h2>
//               <div className="space-y-2">
//                 {account.childAccounts.map((child) => (
//                   <Link
//                     key={child.id}
//                     to={`/accounts/${child.id}`}
//                     className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-sm font-medium link"
//                   >
//                     {child.accountName}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountDetail;
// src/features/accounts/AccountDetail.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchAccount, clearCurrentAccount } from "./accountSlice";
import { formatCurrency, formatLabel, formatDate } from "../../constants";
import Spinner from "../../components/Spinner";
import Avatar from "../../components/Avatar";
import {
  BuildingOffice2Icon,
  PencilSquareIcon,
  PhoneIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  ChartBarIcon,
  StarIcon,
  BuildingOfficeIcon,
  ChevronRightIcon,
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LinkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

// ── Helper Components ──

const SectionCard = ({ title, action, children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value, isLink, href, external }) => {
  if (!value || value === "—") return null;

  const content = (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        {isLink ? (
          <span className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            {value}
            {external && <ArrowTopRightOnSquareIcon className="w-3 h-3" />}
          </span>
        ) : (
          <p className="text-sm font-medium text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );

  if (isLink && href) {
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-50 rounded-lg transition-colors">
        {content}
      </a>
    ) : (
      <Link to={href} className="block hover:bg-gray-50 rounded-lg transition-colors">
        {content}
      </Link>
    );
  }

  return content;
};

const StatCard = ({ icon: Icon, label, value, color = "gray" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm font-semibold text-gray-900 truncate">{value || "—"}</p>
        </div>
      </div>
    </div>
  );
};

const DealCard = ({ deal }) => {
  const getStageColor = (stage) => {
    const colors = {
      qualification: "bg-blue-50 text-blue-700 border-blue-200",
      proposal: "bg-amber-50 text-amber-700 border-amber-200",
      negotiation: "bg-purple-50 text-purple-700 border-purple-200",
      closed_won: "bg-green-50 text-green-700 border-green-200",
      closed_lost: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[stage] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <Link
      to={`/deals/${deal.id}`}
      className="group flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <CurrencyDollarIcon className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
            {deal.dealName}
          </p>
          <p className="text-xs text-gray-500 truncate">{deal.owner?.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(deal.amount)}
          </p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium border ${getStageColor(deal.stage)}`}>
            {formatLabel(deal.stage)}
          </span>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
      </div>
    </Link>
  );
};

const ContactCard = ({ contact }) => (
  <Link
    to={`/contacts/${contact.id}`}
    className="group flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
  >
    <Avatar
      name={contact.firstName}
      secondName={contact.lastName}
      size="sm"
      image={contact.image}
    />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
        {contact.firstName} {contact.lastName || ""}
      </p>
      <p className="text-xs text-gray-500 truncate">{contact.email || contact.title || "—"}</p>
    </div>
    <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
  </Link>
);

const AddressCard = ({ title, icon: Icon, address, color = "indigo" }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  if (!address) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{address}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, action, onAction }) => (
  <div className="text-center py-8">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
      <Icon className="w-6 h-6 text-gray-400" />
    </div>
    <p className="text-sm text-gray-500 mb-3">{title}</p>
    {action && (
      <button
        onClick={onAction}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        {action}
      </button>
    )}
  </div>
);

// ── Main Component ──

const AccountDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account, detailLoading } = useSelector((s) => s.accounts);

  useEffect(() => {
    dispatch(fetchAccount(id));
    return () => dispatch(clearCurrentAccount());
  }, [dispatch, id]);

  if (detailLoading || !account) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const billingAddress = [
    account.billingStreet,
    account.billingCity,
    account.billingState,
    account.billingPincode,
    account.billingCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const shippingAddress = [
    account.shippingStreet,
    account.shippingCity,
    account.shippingState,
    account.shippingPincode,
    account.shippingCountry,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link to="/accounts" className="text-gray-500 hover:text-gray-700 transition-colors">
          Accounts
        </Link>
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium truncate">{account.accountName}</span>
      </nav>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/accounts")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
            </button>

            {account.image ? (
              <img
                src={account.image}
                alt={account.accountName}
                className="w-14 h-14 rounded-xl object-cover border border-gray-200"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <BuildingOffice2Icon className="w-7 h-7 text-white" />
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {account.accountName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                {account.accountNumber && (
                  <span className="text-sm text-gray-500 font-mono">
                    #{account.accountNumber}
                  </span>
                )}
                {account.accountNumber && account.owner?.name && (
                  <span className="text-gray-300">•</span>
                )}
                {account.owner?.name && (
                  <span className="text-sm text-gray-600">
                    Owner: <span className="font-medium">{account.owner.name}</span>
                  </span>
                )}
              </div>
              {account.industry && (
                <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {account.industry}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <button
              onClick={() => navigate(`/accounts/${id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Account
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={PhoneIcon}
          label="Phone"
          value={account.phone}
          color="blue"
        />
        <StatCard
          icon={GlobeAltIcon}
          label="Website"
          value={account.website ? account.website.replace(/^https?:\/\//, '') : null}
          color="green"
        />
        <StatCard
          icon={UserGroupIcon}
          label="Employees"
          value={account.employees?.toLocaleString("en-IN")}
          color="purple"
        />
        <StatCard
          icon={CurrencyRupeeIcon}
          label="Annual Revenue"
          value={formatCurrency(account.annualRevenue)}
          color="amber"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <SectionCard title="Account Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <InfoItem
                icon={BriefcaseIcon}
                label="Account Type"
                value={formatLabel(account.accountType)}
              />
              <InfoItem
                icon={ChartBarIcon}
                label="Industry"
                value={account.industry}
              />
              <InfoItem
                icon={StarIcon}
                label="Rating"
                value={account.rating}
              />
              <InfoItem
                icon={BuildingOfficeIcon}
                label="Ownership"
                value={account.ownership}
              />
              {account.parentAccount && (
                <InfoItem
                  icon={LinkIcon}
                  label="Parent Account"
                  value={account.parentAccount.accountName}
                  isLink
                  href={`/accounts/${account.parentAccount.id}`}
                />
              )}
              {account.website && (
                <InfoItem
                  icon={GlobeAltIcon}
                  label="Website"
                  value={account.website}
                  isLink
                  href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                  external
                />
              )}
            </div>
          </SectionCard>

          {/* Addresses */}
          {(billingAddress || shippingAddress) && (
            <SectionCard title="Addresses">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AddressCard
                  title="Billing Address"
                  icon={MapPinIcon}
                  address={billingAddress}
                  color="indigo"
                />
                <AddressCard
                  title="Shipping Address"
                  icon={MapPinIcon}
                  address={shippingAddress}
                  color="emerald"
                />
              </div>
            </SectionCard>
          )}

          {/* Description */}
          {account.description && (
            <SectionCard title="Description">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {account.description}
              </p>
            </SectionCard>
          )}

          {/* Deals */}
          <SectionCard
            title={`Deals (${account.deals?.length || 0})`}
            action={
              <button
                onClick={() => navigate(`/deals/new?accountId=${id}`)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Deal
              </button>
            }
          >
            {account.deals?.length > 0 ? (
              <div className="space-y-3">
                {account.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CurrencyDollarIcon}
                title="No deals associated yet"
                action="Create first deal"
                onAction={() => navigate(`/deals/new?accountId=${id}`)}
              />
            )}
          </SectionCard>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {account.phone && (
                <a
                  href={`tel:${account.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <PhoneIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Call Account
                  </span>
                </a>
              )}
              {account.website && (
                <a
                  href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <GlobeAltIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Visit Website
                  </span>
                </a>
              )}
              <button
                onClick={() => navigate(`/contacts/new?accountId=${id}`)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group w-full text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Add Contact
                </span>
              </button>
            </div>
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">
                Contacts ({account.contacts?.length || 0})
              </h3>
              <button
                onClick={() => navigate(`/contacts/new?accountId=${id}`)}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <div className="p-3">
              {account.contacts?.length > 0 ? (
                <div className="space-y-2">
                  {account.contacts.slice(0, 5).map((contact) => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                  {account.contacts.length > 5 && (
                    <Link
                      to={`/contacts?accountId=${id}`}
                      className="block text-center py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      View all {account.contacts.length} contacts
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <UserGroupIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No contacts yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Child Accounts */}
          {account.childAccounts?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">
                  Child Accounts ({account.childAccounts.length})
                </h3>
              </div>
              <div className="p-3 space-y-2">
                {account.childAccounts.map((child) => (
                  <Link
                    key={child.id}
                    to={`/accounts/${child.id}`}
                    className="group flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors flex-1 truncate">
                      {child.accountName}
                    </span>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Audit Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Record Information
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-3 py-2 border-b border-gray-50">
                <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-xs font-medium text-gray-700">
                    {formatDate(account.createdAt)}
                    {account.createdBy?.name && (
                      <span className="text-gray-500"> by {account.createdBy.name}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Last Modified</p>
                  <p className="text-xs font-medium text-gray-700">
                    {formatDate(account.updatedAt)}
                    {account.modifiedBy?.name && (
                      <span className="text-gray-500"> by {account.modifiedBy.name}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;