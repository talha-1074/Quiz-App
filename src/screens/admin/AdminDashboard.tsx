// src/screens/admin/AdminDashboard.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminDashboard({ navigation }: any) {
  const { user, logout } = useAuth();
  const [stats,      setStats]      = useState({ teachers: 0, students: 0, quizzes: 0 });
  const [users,      setUsers]      = useState<any[]>([]);
  const [quizzes,    setQuizzes]    = useState<any[]>([]);
  const [activeTab,  setActiveTab]  = useState<'users' | 'quizzes'>('users');
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, usersRes, quizzesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/quizzes'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setQuizzes(quizzesRes.data);
    } catch (error) {
      Alert.alert('Error', 'Could not load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const deleteUser = (id: string) => {
    Alert.alert('Delete User', 'Are you sure you want to remove this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/user/${id}`);
            // Remove from list immediately
            setUsers(prev => prev.filter(u => u._id !== id));
            // Update stats immediately
            setStats(prev => ({
              ...prev,
              students: users.find(u => u._id === id)?.role === 'student'
                ? prev.students - 1 : prev.students,
              teachers: users.find(u => u._id === id)?.role === 'teacher'
                ? prev.teachers - 1 : prev.teachers,
            }));
          } catch {
            Alert.alert('Error', 'Could not delete user');
          }
        }
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day,</Text>
          <Text style={styles.name}>{user?.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>Administrator</Text>
          </View>
        </View>
        <View style={styles.headerBtns}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChangePassword')}
            style={styles.changePwdBtn}
          >
            <Text style={styles.changePwdText}>🔒</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderTopColor: '#2563eb' }]}>
          <Text style={[styles.statNum, { color: '#2563eb' }]}>{stats.teachers}</Text>
          <Text style={styles.statLabel}>Teachers</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#16a34a' }]}>
          <Text style={[styles.statNum, { color: '#16a34a' }]}>{stats.students}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#7c3aed' }]}>
          <Text style={[styles.statNum, { color: '#7c3aed' }]}>{stats.quizzes}</Text>
          <Text style={styles.statLabel}>Quizzes</Text>
        </View>
      </View>

      {/* Refresh hint */}
      <View style={styles.refreshHint}>
        <Text style={styles.refreshHintText}>⬇ Pull down to refresh stats</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.tabActive]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
            All Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quizzes' && styles.tabActive]}
          onPress={() => setActiveTab('quizzes')}
        >
          <Text style={[styles.tabText, activeTab === 'quizzes' && styles.tabTextActive]}>
            All Quizzes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Users List */}
      {activeTab === 'users' ? (
        <FlatList
          data={users}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
              </View>
              {item.role !== 'admin' && (
                <TouchableOpacity
                  style={styles.delBtn}
                  onPress={() => deleteUser(item._id)}
                >
                  <Text style={styles.delBtnText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.quizCard}>
              <Text style={styles.quizTitle}>{item.title}</Text>
              <Text style={styles.quizSub}>{item.subject}</Text>
              <Text style={styles.quizTeacher}>
                By: {item.teacher?.name || 'Unknown'}
              </Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#2563eb',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  greeting:      { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  name:          { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 2 },
  roleBadge:     { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start', marginTop: 6 },
  roleBadgeText: { color: '#fff', fontSize: 12 },
  headerBtns:    { alignItems: 'flex-end', gap: 8 },
  changePwdBtn:  { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20 },
  changePwdText: { fontSize: 16 },
  logoutText:    { color: '#fca5a5', fontWeight: 'bold', fontSize: 14 },

  statsRow:  { flexDirection: 'row', gap: 10, padding: 16 },
  statCard:  { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, borderTopWidth: 4, elevation: 2, alignItems: 'center' },
  statNum:   { fontSize: 26, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },

  refreshHint:     { alignItems: 'center', marginBottom: 4 },
  refreshHintText: { fontSize: 11, color: '#94a3b8' },

  tabs:          { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#e2e8f0', marginHorizontal: 16 },
  tab:           { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -2 },
  tabActive:     { borderBottomColor: '#2563eb' },
  tabText:       { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  tabTextActive: { color: '#2563eb' },

  userRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  avatar:     { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  userInfo:   { flex: 1 },
  userName:   { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  userEmail:  { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  userRole:   { fontSize: 11, color: '#2563eb', marginTop: 2, textTransform: 'capitalize' },
  delBtn:     { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  delBtnText: { color: '#dc2626', fontSize: 12, fontWeight: '600' },

  quizCard:    { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  quizTitle:   { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  quizSub:     { fontSize: 13, color: '#64748b', marginTop: 2 },
  quizTeacher: { fontSize: 12, color: '#94a3b8', marginTop: 6 },
});