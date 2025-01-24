import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../store/authSlice";
import { toast } from "react-hot-toast";
import { RootState } from "../store/store";
import Header from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Add DeleteConfirmationModal component at the top level
function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                   flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Account
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 
                         rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md 
                         hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Account() {
  const user = useSelector((state: RootState) => state.auth.user);
  const localUser = user || JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: "Profile", content: <ProfileTab user={localUser} /> },
    { name: "Your Posts", content: <PostsTab /> },
    { name: "Followers", content: <FollowersTab /> },
    { name: "Following", content: <FollowingTab /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-blue-600">
                {localUser?.name?.[0]?.toUpperCase()}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{localUser?.name}</h2>
                <p className="text-blue-100">@{localUser?.username}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex border-b border-gray-200">
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    classNames(
                      "w-full py-4 px-1 text-sm font-medium text-gray-500 outline-none",
                      selected
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "hover:text-gray-700 hover:border-gray-300"
                    )
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {tabs[selectedTab].content}
                </motion.div>
              </AnimatePresence>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>
    </div>
  );
}

// Tab Components
function ProfileTab({ user }: { user: any }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    dispatch(clearUser());
    toast.success("Account deleted successfully");
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-500">Name</label>
          <p className="text-lg text-gray-900">{user.name}</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-500">Username</label>
          <p className="text-lg text-gray-900">@{user.username}</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-lg text-gray-900">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col space-y-3 pt-6 border-t">
        <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Update Profile
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 
                   border border-red-300 rounded-md shadow-sm text-sm 
                   font-medium text-red-700 bg-white hover:bg-red-50"
        >
          Delete Account
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}

function PostsTab() {
  // Placeholder for posts grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <h3 className="font-medium text-lg">Post Title</h3>
        <p className="text-gray-600 text-sm mt-2">
          Preview of the post content...
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">2 days ago</span>
          <button className="text-blue-600 hover:text-blue-800">Edit</button>
        </div>
      </div>
      {/* Add more post items */}
    </div>
  );
}

function FollowersTab() {
  // Placeholder for followers list
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="font-medium text-gray-600">JD</span>
          </div>
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-500">@johndoe</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-800">Remove</button>
      </div>
      {/* Add more follower items */}
    </div>
  );
}

function FollowingTab() {
  // Placeholder for following list
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="font-medium text-gray-600">JS</span>
          </div>
          <div>
            <p className="font-medium">Jane Smith</p>
            <p className="text-sm text-gray-500">@janesmith</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-800">Unfollow</button>
      </div>
      {/* Add more following items */}
    </div>
  );
}
