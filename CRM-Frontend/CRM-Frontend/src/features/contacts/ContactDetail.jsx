// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { fetchContact, clearCurrentContact } from "./contactSlice";
// import { formatCurrency, formatDate, formatLabel } from "../../constants";
// import Spinner from "../../components/Spinner";
// import Avatar from "../../components/Avatar";
// import DetailField from "../../components/DetailField";
// import { PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// const ContactDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { contact, detailLoading } = useSelector((s) => s.contacts);

//   useEffect(() => { dispatch(fetchContact(id)); return () => dispatch(clearCurrentContact()); }, [dispatch, id]);

//   if (detailLoading || !contact) return <Spinner className="py-20" />;

//   const fullName = `${contact.firstName} ${contact.lastName || ""}`.trim();

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex items-start justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate("/contacts")} className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeftIcon className="w-5 h-5 text-gray-500" /></button>
//           <Avatar name={contact.firstName} secondName={contact.lastName} size="xl" />
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
//             <p className="text-sm text-gray-500">
//               {contact.title && `${contact.title} · `}
//               <Link to={`/accounts/${contact.account?.id}`} className="link">{contact.account?.accountName}</Link>
//             </p>
//           </div>
//         </div>
//         <button onClick={() => navigate(`/contacts/${id}/edit`)} className="btn-primary"><PencilSquareIcon className="w-5 h-5 mr-1.5" /> Edit</button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="card">
//             <h2 className="section-title mb-4">Contact Details</h2>
//             <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//               <DetailField label="Email" value={contact.email} />
//               <DetailField label="Phone" value={contact.phone} />
//               <DetailField label="Mobile" value={contact.mobile} />
//               <DetailField label="Department" value={contact.department} />
//               <DetailField label="Title" value={contact.title} />
//               <DetailField label="Owner" value={contact.owner?.name} />
//             </div>
//           </div>

//           <div className="card">
//             <h2 className="section-title mb-4">Mailing Address</h2>
//             <p className="text-sm text-gray-700">
//               {[contact.mailingFlat, contact.mailingStreet, contact.mailingCity, contact.mailingState, contact.mailingZip, contact.mailingCountry].filter(Boolean).join(", ") || "—"}
//             </p>
//           </div>

//           {contact.description && (
//             <div className="card">
//               <h2 className="section-title mb-4">Description</h2>
//               <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.description}</p>
//             </div>
//           )}

//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="section-title">Deals ({contact.deals?.length || 0})</h2>
//               <button onClick={() => navigate(`/deals/new?accountId=${contact.accountId}&contactId=${contact.id}`)} className="link text-sm">+ Add Deal</button>
//             </div>
//             {contact.deals?.length > 0 ? (
//               <div className="space-y-2">
//                 {contact.deals.map((d) => (
//                   <Link key={d.id} to={`/deals/${d.id}`} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
//                     <p className="font-medium text-sm">{d.dealName}</p>
//                     <div className="text-right">
//                       <p className="text-sm font-semibold">{formatCurrency(d.amount)}</p>
//                       <span className="text-xs text-gray-500">{formatLabel(d.stage)}</span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             ) : <p className="text-gray-400 text-sm text-center py-6">No deals yet</p>}
//           </div>
//         </div>

//         <div className="card h-fit">
//           <h2 className="section-title mb-4">Audit Info</h2>
//           <div className="space-y-3">
//             <DetailField label="Created By" value={contact.createdBy?.name} />
//             <DetailField label="Modified By" value={contact.modifiedBy?.name} />
//             <DetailField label="Created At" value={formatDate(contact.createdAt)} />
//             <DetailField label="Updated At" value={formatDate(contact.updatedAt)} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactDetail;
// src/features/contacts/ContactDetail.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchContact, clearCurrentContact } from "./contactSlice";
import { formatCurrency, formatDate, formatLabel } from "../../constants";
import Spinner from "../../components/Spinner";
import Avatar from "../../components/Avatar";
import {
  PencilSquareIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  UserIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const InfoItem = ({ icon: Icon, label, value, isLink, to }) => {
  if (!value) return null;
  
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        {isLink ? (
          <Link to={to} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            {value}
          </Link>
        ) : (
          <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
        )}
      </div>
    </div>
  );
};

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

const AuditItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-xs font-medium text-gray-700">{value || "—"}</span>
  </div>
);

const DealCard = ({ deal }) => {
  const getStageColor = (stage) => {
    const colors = {
      qualification: "bg-blue-50 text-blue-700",
      proposal: "bg-amber-50 text-amber-700",
      negotiation: "bg-purple-50 text-purple-700",
      closed_won: "bg-green-50 text-green-700",
      closed_lost: "bg-red-50 text-red-700",
    };
    return colors[stage] || "bg-gray-50 text-gray-700";
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
          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${getStageColor(deal.stage)}`}>
            {formatLabel(deal.stage)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(deal.amount)}
        </p>
        <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
      </div>
    </Link>
  );
};

const ContactDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contact, detailLoading } = useSelector((s) => s.contacts);

  useEffect(() => {
    dispatch(fetchContact(id));
    return () => dispatch(clearCurrentContact());
  }, [dispatch, id]);

  if (detailLoading || !contact) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const fullName = `${contact.firstName} ${contact.lastName || ""}`.trim();
  
  const mailingAddress = [
    contact.mailingFlat,
    contact.mailingStreet,
    contact.mailingCity,
    contact.mailingState,
    contact.mailingZip,
    contact.mailingCountry,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link to="/contacts" className="text-gray-500 hover:text-gray-700 transition-colors">
          Contacts
        </Link>
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium truncate">{fullName}</span>
      </nav>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/contacts")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
            </button>
            
            <Avatar
              name={contact.firstName}
              secondName={contact.lastName}
              size="xl"
              image={contact.image}
            />
            
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                {contact.title && (
                  <span className="text-sm text-gray-600">{contact.title}</span>
                )}
                {contact.title && contact.account && (
                  <span className="text-gray-300">•</span>
                )}
                {contact.account && (
                  <Link
                    to={`/accounts/${contact.account?.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {contact.account?.accountName}
                  </Link>
                )}
              </div>
              {contact.email && (
                <p className="text-sm text-gray-500 mt-1">{contact.email}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <button
              onClick={() => navigate(`/contacts/${id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Contact
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <SectionCard title="Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <InfoItem 
                icon={EnvelopeIcon} 
                label="Email Address" 
                value={contact.email} 
              />
              <InfoItem 
                icon={PhoneIcon} 
                label="Phone" 
                value={contact.phone} 
              />
              <InfoItem 
                icon={DevicePhoneMobileIcon} 
                label="Mobile" 
                value={contact.mobile} 
              />
              <InfoItem 
                icon={BuildingOfficeIcon} 
                label="Department" 
                value={contact.department} 
              />
              <InfoItem 
                icon={BriefcaseIcon} 
                label="Title" 
                value={contact.title} 
              />
              <InfoItem 
                icon={UserIcon} 
                label="Owner" 
                value={contact.owner?.name} 
              />
            </div>
            
            {contact.leadSource && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Lead Source</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700">
                  {formatLabel(contact.leadSource)}
                </span>
              </div>
            )}
          </SectionCard>

          {/* Address */}
          {mailingAddress && (
            <SectionCard title="Mailing Address">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pt-2">
                  {mailingAddress}
                </p>
              </div>
            </SectionCard>
          )}

          {/* Description */}
          {contact.description && (
            <SectionCard title="Description">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {contact.description}
              </p>
            </SectionCard>
          )}

          {/* Deals */}
          <SectionCard
            title={`Deals (${contact.deals?.length || 0})`}
            action={
              <button
                onClick={() =>
                  navigate(
                    `/deals/new?accountId=${contact.accountId}&contactId=${contact.id}`
                  )
                }
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Deal
              </button>
            }
          >
            {contact.deals?.length > 0 ? (
              <div className="space-y-3">
                {contact.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <CurrencyDollarIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-3">No deals associated yet</p>
                <button
                  onClick={() =>
                    navigate(
                      `/deals/new?accountId=${contact.accountId}&contactId=${contact.id}`
                    )
                  }
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Create first deal
                </button>
              </div>
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
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Send Email
                  </span>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <PhoneIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Call Contact
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Account Info */}
          {contact.account && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Associated Account
              </h3>
              <Link
                to={`/accounts/${contact.account.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {contact.account.accountName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600">
                    {contact.account.accountName}
                  </p>
                  <p className="text-xs text-gray-500">View account</p>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
              </Link>
            </div>
          )}

          {/* Audit Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Record Information
            </h3>
            <div className="space-y-1 divide-y divide-gray-50">
              <div className="flex items-center gap-3 py-2">
                <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-xs font-medium text-gray-700">
                    {formatDate(contact.createdAt)}
                    {contact.createdBy?.name && (
                      <span className="text-gray-500"> by {contact.createdBy.name}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <ClockIcon className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Last Modified</p>
                  <p className="text-xs font-medium text-gray-700">
                    {formatDate(contact.updatedAt)}
                    {contact.modifiedBy?.name && (
                      <span className="text-gray-500"> by {contact.modifiedBy.name}</span>
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

export default ContactDetail;