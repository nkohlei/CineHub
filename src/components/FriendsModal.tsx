"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Inbox, Trash2, Check, UserPlus, UserMinus, Plus, Loader2, MessageSquare, ListMusic, Eye, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Friend {
  id: string;
  name: string;
  email?: string;
  image?: string;
  shareId: string;
}

interface InboxItem {
  id: string;
  type: "movie" | "list";
  from: string;
  senderName: string;
  data: any;
  timestamp: string;
}

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  inbox: InboxItem[];
  onAddFriend: (shareId: string) => Promise<string | null>; // Returns error message if failed, or null if success
  onRemoveFriend: (friendId: string) => Promise<boolean>;
  onAcceptShare: (inboxItemId: string) => Promise<number | null>; // Returns added count if success, null if failed
  onDeleteShare: (inboxItemId: string) => Promise<boolean>;
}

export default function FriendsModal({
  isOpen,
  onClose,
  friends,
  inbox,
  onAddFriend,
  onRemoveFriend,
  onAcceptShare,
  onDeleteShare,
}: FriendsModalProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"friends" | "inbox">("friends");
  const [shareIdInput, setShareIdInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  
  // Tracking action loaders on individual items
  const [actioningItemId, setActioningItemId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"accept" | "delete" | "remove" | null>(null);

  if (!isOpen) return null;

  const handleAddFriendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareIdInput.trim() || shareIdInput.length < 6) return;
    setAdding(true);
    setAddError("");
    const errorMsg = await onAddFriend(shareIdInput);
    setAdding(false);
    if (errorMsg) {
      setAddError(errorMsg);
    } else {
      setShareIdInput("");
    }
  };

  const handleRemoveFriendClick = async (friendId: string) => {
    setActioningItemId(friendId);
    setActionType("remove");
    await onRemoveFriend(friendId);
    setActioningItemId(null);
    setActionType(null);
  };

  const handleAcceptClick = async (itemId: string) => {
    setActioningItemId(itemId);
    setActionType("accept");
    await onAcceptShare(itemId);
    setActioningItemId(null);
    setActionType(null);
  };

  const handleDeleteClick = async (itemId: string) => {
    setActioningItemId(itemId);
    setActionType("delete");
    await onDeleteShare(itemId);
    setActioningItemId(null);
    setActionType(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden bg-zinc-950/90 border border-zinc-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 flex flex-col max-h-[85vh] backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900 bg-zinc-900/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{t.friendsTitle}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-zinc-800 transition-all text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex px-6 border-b border-zinc-900 bg-zinc-950/50">
            <button
              onClick={() => setActiveTab("friends")}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "friends"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{language === "tr" ? "Arkadaşlar" : "Friends"}</span>
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                {friends.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "inbox"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>{language === "tr" ? "Gelen Kutusu" : "Inbox"}</span>
              {inbox.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse">
                  {inbox.length}
                </span>
              )}
            </button>
          </div>

          {/* Modal Tab Contents (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-none space-y-6">
            {activeTab === "friends" && (
              <>
                {/* Add Friend Form */}
                <form onSubmit={handleAddFriendSubmit} className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block">
                    {language === "tr" ? "Paylaşım Koduyla Arkadaş Ekle" : "Add Friend by Share ID"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={shareIdInput}
                      onChange={(e) => setShareIdInput(e.target.value.toUpperCase())}
                      placeholder={t.friendPlaceholder}
                      className="flex-1 px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500/50 transition-all font-semibold tracking-wider font-mono"
                    />
                    <button
                      type="submit"
                      disabled={adding || shareIdInput.length < 6}
                      className="flex items-center gap-1.5 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {adding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      <span>{t.addFriend}</span>
                    </button>
                  </div>
                  {addError && (
                    <p className="text-xs font-medium text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                      {addError}
                    </p>
                  )}
                </form>

                {/* Friends List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                    {language === "tr" ? "Arkadaşlarım" : "My Friends"}
                  </h4>
                  {friends.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-zinc-900 rounded-2xl">
                      <Users className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                      <p className="text-sm text-zinc-500">{t.noFriends}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {friends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-900/80 hover:border-zinc-800/80 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {friend.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={friend.image}
                                alt={friend.name}
                                className="w-10 h-10 rounded-full border border-purple-500/20 object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                                {friend.name?.[0] || "U"}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{friend.name}</p>
                              {friend.email && (
                                <p className="text-xs text-zinc-500 truncate">{friend.email}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                              {friend.shareId}
                            </span>
                            <button
                              disabled={actioningItemId === friend.id}
                              onClick={() => handleRemoveFriendClick(friend.id)}
                              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/10 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {actioningItemId === friend.id && actionType === "remove" ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                              ) : (
                                <UserMinus className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "inbox" && (
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                  {language === "tr" ? "Gelen Paylaşımlar" : "Received Shares"}
                </h4>
                {inbox.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-zinc-900 rounded-2xl">
                    <Inbox className="w-9 h-9 text-zinc-700 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">{t.emptyInbox}</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {inbox.map((item) => {
                      const isMovie = item.type === "movie";
                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900/80 hover:border-zinc-800/80 transition-all space-y-4"
                        >
                          {/* Share info header */}
                          <div className="flex items-center justify-between border-b border-zinc-900/80 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {isMovie ? (
                                  <Eye className="w-3.5 h-3.5" />
                                ) : (
                                  <ListMusic className="w-3.5 h-3.5" />
                                )}
                              </span>
                              <span className="text-xs text-zinc-400 font-medium">
                                {t.incomingShare}: <strong className="text-white font-bold">{item.senderName}</strong>
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {new Date(item.timestamp).toLocaleDateString(
                                language === "tr" ? "tr-TR" : "en-US",
                                { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>

                          {/* Content Body */}
                          {isMovie ? (
                            <div className="flex gap-3">
                              {item.data.posterPath ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${item.data.posterPath}`}
                                  alt={item.data.title}
                                  className="w-14 rounded-lg object-cover aspect-[2/3] border border-zinc-800 bg-zinc-900 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-14 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 aspect-[2/3] text-[9px] text-zinc-600 font-bold text-center p-1">
                                  NO IMAGE
                                </div>
                              )}
                              <div className="min-w-0 flex-1 flex flex-col justify-center">
                                <h5 className="text-sm font-bold text-white truncate">{item.data.title}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                  {item.data.releaseDate && (
                                    <span className="text-xs text-zinc-500">
                                      {item.data.releaseDate.substring(0, 4)}
                                    </span>
                                  )}
                                  {item.data.imdbRating && item.data.imdbRating !== "ERR: " && (
                                    <span className="text-[10px] font-bold text-[#F5C518] bg-[#F5C518]/10 border border-[#F5C518]/20 px-1.5 py-0.5 rounded font-mono">
                                      IMDb {item.data.imdbRating}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">
                                  {language === "tr" ? "Paylaşılan İzleme Listesi" : "Shared Watchlist"}
                                </span>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                                  {item.data.length} {language === "tr" ? "Film" : "Movies"}
                                </span>
                              </div>
                              {/* Inline mini-poster carousel of the list */}
                              <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1 bg-zinc-950/40 p-2 rounded-xl border border-zinc-900/60">
                                {item.data.slice(0, 8).map((m: any, idx: number) => (
                                  <div key={idx} className="relative flex-shrink-0 w-8 aspect-[2/3] rounded bg-zinc-900 overflow-hidden border border-zinc-800/80">
                                    {m.posterPath ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={`https://image.tmdb.org/t/p/w92${m.posterPath}`}
                                        alt={m.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[6px] font-bold text-zinc-700">NO</div>
                                    )}
                                  </div>
                                ))}
                                {item.data.length > 8 && (
                                  <div className="flex-shrink-0 w-8 aspect-[2/3] rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 font-bold">
                                    +{item.data.length - 8}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2 border-t border-zinc-900/80 pt-3">
                            <button
                              disabled={actioningItemId !== null}
                              onClick={() => handleDeleteClick(item.id)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-red-500/5 border border-zinc-800 hover:border-red-500/20 text-zinc-400 hover:text-red-400 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                            >
                              {actioningItemId === item.id && actionType === "delete" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              <span>{t.confirm === "Onayla" ? "Yoksay" : "Ignore"}</span>
                            </button>

                            <button
                              disabled={actioningItemId !== null}
                              onClick={() => handleAcceptClick(item.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
                            >
                              {actioningItemId === item.id && actionType === "accept" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              <span>{isMovie ? t.acceptMovie : t.mergeList}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
